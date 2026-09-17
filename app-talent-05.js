  document.querySelectorAll(".loc-seg button").forEach((b) => b.classList.toggle("on", b.dataset.l === v));
  const phys = v === "Physical" || v === "Hybrid";
  const virt = v === "Virtual" || v === "Hybrid";
  document.getElementById("place-wrap").classList.toggle("hidden", !phys);
  document.getElementById("url-wrap").classList.toggle("hidden", !virt);
  document.getElementById("host-wrap").classList.toggle("hidden", !virt);
}
function validate() {
  const name = document.getElementById("f-name").value.trim();
  const start = document.getElementById("f-start").value;
  const end = document.getElementById("f-end").value;
  document.getElementById("submit-btn").disabled = !(name && start && end && start <= end);
}
function closeModal() { document.getElementById("overlay").classList.add("hidden"); ui.editingId = null; }

function submitForm() {
  syncDraftQuestions();
  const loc = document.querySelector(".loc-seg button.on").dataset.l;
  const payload = {
    name: document.getElementById("f-name").value.trim(),
    description: document.getElementById("f-desc").value.trim(),
    visibility: document.querySelector(".seg-vis button.on").dataset.v,
    category: document.getElementById("f-cat").value,
    locationMode: loc,
    place: document.getElementById("f-place").value.trim(),
    meetingUrl: document.getElementById("f-url").value.trim(),
    startAt: document.getElementById("f-start").value,
    endAt: document.getElementById("f-end").value,
    guests: guestsFromChips(),
    reminders: document.getElementById("f-remind").value,
    enumHostsMeeting: document.getElementById("f-host").checked,
    image: document.getElementById("preview").classList.contains("hidden") ? "" : document.getElementById("preview").src,
    capacity: document.getElementById("f-cap").value,
    privacy: document.getElementById("f-privacy").value,
    approval: document.getElementById("f-approval").checked,
    waitlist: document.getElementById("f-waitlist").checked,
    ticket: document.getElementById("f-ticket").value,
    price: Number(document.getElementById("f-price").value || 0),
    sms: document.getElementById("f-sms").value,
    regWindow: document.getElementById("f-regwin").value,
    opensAt: document.getElementById("f-opens").value,
    earlyEntry: document.getElementById("f-early").checked,
    waitingRoom: document.getElementById("f-waiting").checked,
    questions: ui.draftQuestions.map((q, i) => ({ ...q, id: q.id || "q" + (i + 1) })),
    series: document.getElementById("f-series").value.trim()
  };
  if (ui.editingId) {
    const cap = Number(payload.capacity);
    const ev = eventBy(ui.editingId);
    if (cap && goingCount(ev) > cap) {
      ask(`There are already ${goingCount(ev)} going. They will keep their spots.`, () => {
        payload.capacity = goingCount(ev);
        Object.assign(ev, payload);
        save(); closeModal(); render();
      });
      return;
    }
    Object.assign(ev, payload);
  } else {
    db.events.push({ id: "e" + Date.now(), roomOpen: false, lifecycle: "Scheduled", views: 0, discoverable: payload.visibility === "Public", ...payload });
  }
  save(); closeModal(); render();
}

function ask(copy, yes, title) {
  document.getElementById("confirm-title").textContent = title || "Confirm";
  document.getElementById("confirm-copy").textContent = copy;
  document.getElementById("confirm-overlay").classList.remove("hidden");
  ui.confirm = yes;
}

function lifecycle(ev, action) {
  if (action === "cancel") {
    ask(`Event cancelled. ${goingCount(ev)} people will be notified.`, () => {
      ev.lifecycle = "Cancelled";
      ev.roomOpen = false;
      regsFor(ev.id).forEach((r) => { if (["Going", "Checked in"].includes(r.status)) r.eventCancelled = true; });
      save(); toast("Event cancelled. People will be notified."); render();
    });
  }
  if (action === "archive") {
    if (statusOf(ev) !== "Ended" && ev.lifecycle !== "Cancelled") { toast("Archive ended or cancelled events."); return; }
    ev.archived = true; save(); toast("Event archived."); go("#/edu"); render();
  }
  if (action === "delete") {
    if (goingCount(ev) && ev.lifecycle !== "Cancelled") {
      ask("This event must be cancelled before it can be deleted. Cancel event.", () => lifecycle(ev, "cancel"), "Can’t delete yet");
      return;
    }
    ev.lifecycle = "Deleted"; save(); toast("Event deleted."); go("#/edu"); render();
  }
}

function openEmbed(ev) {
  const code = `<iframe src="${location.origin}${location.pathname}#/talent/event/${ev.id}" title="${ev.name}" width="360" height="520"></iframe>`;
  document.getElementById("embed-code").value = code;
  document.getElementById("embed-overlay").classList.remove("hidden");
}

function duplicateEvent(ev) {
  const copy = { ...ev, id: "e" + Date.now(), name: ev.name + " (copy)", views: 0, roomOpen: false, lifecycle: "Scheduled", groupingDismissed: false };
  db.events.push(copy);
  save();
  toast("Duplicated. Each date is its own Join.");
  render();
}

function sampleImportRows(ev) {
  return [
    { name: "New Guest", email: "guest.ok@enumverse.com", ok: true, note: "" },
    { name: "Bad row", email: "not-an-email", ok: false, note: "not-an-email is not a valid email and was not added." },
    { name: "Ada Okonkwo", email: "ada@enumverse.com", ok: false, note: "already on the list" }
  ].map((row) => {
    const dup = regsFor(ev.id).some((r) => person(r.personId)?.email === row.email);
    if (dup) return { ...row, ok: false, note: "already on the list" };
    return row;
  });
}

function renderImportPreview() {
  const rows = ui.importRows || [];
  const el = document.getElementById("import-preview");
  if (!rows.length) {
    el.innerHTML = `<p class="hint">No rows to import. Download the template and try again.</p>`;
    return;
  }
  const bad = rows.filter((r) => !r.ok).length;
  el.innerHTML = `<p class="hint">${rows.filter((r) => r.ok).length} good · ${bad} skipped</p>
    <table><thead><tr><th>Name</th><th>Email</th><th></th></tr></thead><tbody>
    ${rows.map((r) => `<tr class="${r.ok ? "" : "bad"}"><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.email)}</td><td>${escapeHtml(r.note || (r.ok ? "OK" : ""))}</td></tr>`).join("")}
    </tbody></table>`;
}

function openImportPreview() {
  const ev = eventBy(ui.route.id);
  ui.importRows = sampleImportRows(ev);
  renderImportPreview();
  document.getElementById("import-overlay").classList.remove("hidden");
}

window.addEventListener("hashchange", render);
document.addEventListener("click", (e) => {
  if (!e.target.closest(".filter-root")) {
    document.querySelectorAll(".menu").forEach((el) => el.classList.add("hidden"));
    document.querySelectorAll(".submenu").forEach((el) => el.classList.add("hidden"));
  }
  if (!e.target.closest(".kebab") && !e.target.closest(".row-menu")) document.getElementById("row-menu")?.remove();
  if (!e.target.closest("#detail-more") && !e.target.closest("#detail-overflow")) {
    document.getElementById("detail-overflow")?.classList.add("hidden");
  }
  if (!e.target.closest("#edu-ji") && !e.target.closest("#talent-ji") && !e.target.closest("#ji-menu")) {
    document.getElementById("ji-menu")?.classList.add("hidden");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".demo-app").forEach((b) => b.onclick = () => {
    go(b.dataset.app === "edu" ? "#/edu" : "#/talent");
  });

  function placeJiMenu(anchor) {
    const menu = document.getElementById("ji-menu");
    const r = anchor.getBoundingClientRect();
    menu.style.top = `${r.bottom + 6}px`;
    menu.style.left = `${r.left}px`;
    menu.classList.toggle("hidden");
  }
  document.getElementById("edu-ji").onclick = (e) => { e.stopPropagation(); placeJiMenu(e.currentTarget); };
  document.getElementById("talent-ji").onclick = (e) => { e.stopPropagation(); placeJiMenu(e.currentTarget); };
  document.querySelectorAll("#ji-menu [data-role]").forEach((b) => {
    b.onclick = () => {
      document.getElementById("ji-menu").classList.add("hidden");
      go(b.dataset.role === "edu" ? "#/edu" : "#/talent");
    };
  });

  document.getElementById("create-btn").onclick = () => openModal();
  document.getElementById("support-chat").onclick = () => toast("Support chat is global chrome — not part of Events.");
  document.querySelectorAll("#view-edu-home .tab[data-tab]").forEach((t) => t.onclick = () => { ui.tab = t.dataset.tab; ui.page = 1; render(); });
  document.getElementById("btn-list").onclick = () => { ui.view = "list"; render(); };
  document.getElementById("btn-cal").onclick = () => { ui.view = "calendar"; render(); };
  document.getElementById("btn-list-2").onclick = () => { ui.view = "list"; render(); };
  document.getElementById("btn-cal-2").onclick = () => { ui.view = "calendar"; render(); };
  document.getElementById("search").oninput = (e) => { ui.search = e.target.value; ui.page = 1; render(); };
  document.getElementById("page-size").onchange = (e) => { ui.pageSize = +e.target.value; ui.page = 1; render(); };
  document.getElementById("prev").onclick = () => { if (ui.page > 1) { ui.page--; render(); } };
  document.getElementById("next").onclick = () => { ui.page++; render(); };
  document.getElementById("filter-btn").onclick = (ev) => { ev.stopPropagation(); document.getElementById("filter-menu").classList.toggle("hidden"); };
  document.querySelectorAll("[data-sub]").forEach((b) => {
    b.onmouseenter = () => {
      document.querySelectorAll(".submenu").forEach((el) => el.classList.add("hidden"));
      document.getElementById("sub-" + b.dataset.sub).classList.remove("hidden");
    };
  });
  document.querySelectorAll("[data-type]").forEach((b) => b.onclick = () => { ui.typeFilter = ui.typeFilter === b.dataset.type ? "" : b.dataset.type; render(); });
  document.querySelectorAll("[data-loc]").forEach((b) => b.onclick = () => { ui.locFilter = ui.locFilter === b.dataset.loc ? "" : b.dataset.loc; render(); });
  document.querySelectorAll("[data-date]").forEach((b) => b.onclick = () => { ui.dateFilter = ui.dateFilter === b.dataset.date ? "" : b.dataset.date; render(); });
