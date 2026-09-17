
  document.getElementById("tbody").addEventListener("click", (e) => {
    const open = e.target.closest("[data-open]");
    if (open) { go(`#/edu/event/${open.dataset.open}`); return; }
    const btn = e.target.closest(".kebab");
    if (!btn) return;
    document.getElementById("row-menu")?.remove();
    const menu = document.createElement("div");
    menu.id = "row-menu";
    menu.className = "row-menu";
    menu.innerHTML = `<button type="button" data-do="open">Open</button><button type="button" data-do="edit">Edit</button>`;
    btn.parentElement.style.position = "relative";
    btn.parentElement.appendChild(menu);
    menu.onclick = (ev2) => {
      const act = ev2.target.dataset.do;
      const id = btn.dataset.edit;
      if (act === "open") go(`#/edu/event/${id}`);
      if (act === "edit") openModal(id);
      menu.remove();
    };
  });

  document.getElementById("cal-mode").onchange = (e) => { ui.calMode = e.target.value; render(); };
  document.getElementById("cal-prev").onclick = () => {
    const d = ui.calCursor;
    if (ui.calMode === "day") d.setDate(d.getDate() - 1);
    if (ui.calMode === "week") d.setDate(d.getDate() - 7);
    if (ui.calMode === "month") d.setMonth(d.getMonth() - 1);
    if (ui.calMode === "year") d.setFullYear(d.getFullYear() - 1);
    render();
  };
  document.getElementById("cal-next").onclick = () => {
    const d = ui.calCursor;
    if (ui.calMode === "day") d.setDate(d.getDate() + 1);
    if (ui.calMode === "week") d.setDate(d.getDate() + 7);
    if (ui.calMode === "month") d.setMonth(d.getMonth() + 1);
    if (ui.calMode === "year") d.setFullYear(d.getFullYear() + 1);
    render();
  };
  document.getElementById("today-btn").onclick = () => { ui.calCursor = new Date(NOW); render(); };

  document.getElementById("close-modal").onclick = closeModal;
  document.getElementById("cancel-modal").onclick = closeModal;
  document.getElementById("overlay").addEventListener("click", (e) => { if (e.target.id === "overlay") closeModal(); });
  document.querySelectorAll(".seg-vis button").forEach((b) => b.onclick = () => { setVis(b.dataset.v); validate(); });
  document.querySelectorAll(".loc-seg button").forEach((b) => b.onclick = () => { setLoc(b.dataset.l); validate(); });
  ["f-name", "f-start", "f-end"].forEach((id) => document.getElementById(id).addEventListener("input", validate));
  document.getElementById("f-ticket").onchange = (e) => document.getElementById("price-wrap").classList.toggle("hidden", e.target.value !== "paid");
  document.getElementById("submit-btn").onclick = submitForm;
  document.getElementById("add-guest").onclick = () => {
    const v = document.getElementById("f-guest").value.trim();
    if (!v || !v.includes("@")) return;
    document.getElementById("guest-chips").insertAdjacentHTML("beforeend", `<span class="chip" data-g="${escapeHtml(v)}">${escapeHtml(v)} ×</span>`);
    document.getElementById("f-guest").value = "";
  };
  document.getElementById("guest-chips").onclick = (e) => e.target.closest(".chip")?.remove();
  document.getElementById("upload-btn").onclick = () => document.getElementById("file").click();
  document.getElementById("file").onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { alert("This file is too large. The maximum size is 5MB."); return; }
    if (!/^image\/(png|jpeg)$/.test(f.type)) { alert("This file type is not supported. Upload PNG or JPEG."); return; }
    const r = new FileReader();
    r.onload = () => { document.getElementById("preview").src = r.result; document.getElementById("preview").classList.remove("hidden"); };
    r.readAsDataURL(f);
  };

  document.getElementById("back-edu").onclick = () => go("#/edu");
  document.getElementById("detail-edit").onclick = () => openModal(ui.route.id);
  document.getElementById("detail-more").onclick = () => document.getElementById("detail-overflow").classList.toggle("hidden");
  document.getElementById("detail-start-room").onclick = () => {
    const ev = eventBy(ui.route.id);
    attemptJoin(ev, myReg(ev.id), true);
  };
  document.getElementById("detail-overflow").onclick = (e) => {
    const act = e.target.dataset.act;
    const id = ui.route.id;
    if (act === "checkin") go(`#/edu/event/${id}/checkin`);
    if (act === "summary") go(`#/edu/event/${id}/summary`);
    if (act === "grouping") go(`#/edu/event/${id}/grouping`);
    if (act === "insights") go(`#/edu/event/${id}/insights`);
    if (act === "embed") openEmbed(eventBy(id));
    if (act === "duplicate") duplicateEvent(eventBy(id));
    if (act === "cancel") lifecycle(eventBy(id), "cancel");
    if (act === "archive") lifecycle(eventBy(id), "archive");
    if (act === "delete") lifecycle(eventBy(id), "delete");
  };
  document.querySelectorAll("[data-dtab]").forEach((t) => t.onclick = () => { ui.dtab = t.dataset.dtab; render(); });
  document.getElementById("p-search").oninput = () => renderDetail();
  document.getElementById("p-status-tabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-pstat]");
    if (b) { ui.pFilter = b.dataset.pstat; render(); }
  });
  document.getElementById("p-tbody").addEventListener("click", (e) => {
    const b = e.target.closest("[data-do]");
    if (!b) return;
    const r = db.registrations.find((x) => x.id === b.dataset.reg);
    if (b.dataset.do === "approve") { r.status = "Going"; r.ticket = r.ticket || ticketCode(); toast("Approved."); }
    if (b.dataset.do === "decline") { r.status = "Cancelled"; toast("Your request was not approved."); }
    if (b.dataset.do === "promote") { r.status = "Going"; r.ticket = ticketCode(); toast("Promoted from waitlist."); }
    if (b.dataset.do === "reverse") {
      ask(`Remove check-in for ${person(r.personId).name}?`, () => { r.status = "Going"; r.checkedInAt = ""; save(); render(); });
      return;
    }
    save(); render();
  });
  document.getElementById("p-invite").onclick = () => document.getElementById("invite-overlay").classList.remove("hidden");
  document.getElementById("p-import").onclick = () => openImportPreview();
  document.getElementById("p-export").onclick = () => {
    const ev = eventBy(ui.route.id);
    const header = ["name","email","status","source","ticket","checked_in","joined","answers"];
    const lines = [header.join(","), ...regsFor(ev.id).map((r) => {
      const p = person(r.personId);
      return [p.name, p.email, r.status, r.source, r.ticket, r.checkedInAt || "", r.joined ? "yes" : "no", r.answers || ""]
        .map(csvSafe).join(",");
    })];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\uFEFF" + lines.join("\n")]));
    a.download = `${ev.id}-participants.csv`;
    a.click();
    toast("CSV exported. Formula-looking cells are prefixed so they stay text.");
  };
  document.getElementById("p-message").onclick = () => {
    const ev = eventBy(ui.route.id);
    const segs = ["Going", "Pending", "Waitlisted", "Checked in", "Invited", "Cancelled", "No-show"];
    document.getElementById("blast-seg").innerHTML = segs.map((s) => `<option>${s} (${regsFor(ev.id).filter((r) => r.status === s).length})</option>`).join("");
    document.getElementById("blast-overlay").classList.remove("hidden");
    document.getElementById("blast-count").textContent = "";
  };

  document.getElementById("back-checkin").onclick = () => go(`#/edu/event/${ui.route.id}`);
  document.getElementById("scan-btn").onclick = () => doCheckin(document.getElementById("scan-code").value);
  document.getElementById("scan-name").oninput = () => renderCheckin();
  document.getElementById("scan-camera").onclick = () => {
    ui.cameraDenied = !ui.cameraDenied;
    toast(ui.cameraDenied ? "Allow camera, or search by name." : "Camera ready (simulated).");
    renderCheckin();
  };
  document.getElementById("scan-offline").onchange = (e) => { ui.checkinOffline = e.target.checked; };
  document.getElementById("checkin-list").addEventListener("click", (e) => {
    const b = e.target.closest("[data-scan]");
    if (b) doCheckin(b.dataset.scan);
  });
  document.getElementById("back-summary").onclick = () => go(`#/edu/event/${ui.route.id}`);
  document.getElementById("publish-summary").onclick = () => {
    const s = db.summary[ui.route.id];
    if (!s) { toast("This session wasn’t recorded, so there’s no summary."); return; }
    if (s.status === "failed") { toast("Summary unavailable. Retry."); return; }
    s.status = "published"; save(); toast("Published to attendees."); render();
  };
  document.getElementById("retry-summary").onclick = () => {
    const s = db.summary[ui.route.id] || { status: "failed", summary: "", key_details: [], decisions: [], action_items: [] };
    s.status = "processing";
    db.summary[ui.route.id] = s;
    save(); render();
    setTimeout(() => {
      s.status = "draft";
      s.summary = s.summary || "No speech detected.";
      s.key_details = s.key_details?.length ? s.key_details : [];
      s.action_items = s.action_items || [];
      save(); render();
    }, 600);
  };
  document.getElementById("back-group").onclick = () => go(`#/edu/event/${ui.route.id}`);
  document.getElementById("back-insights").onclick = () => go(`#/edu/event/${ui.route.id}`);

  document.getElementById("talent-nav").addEventListener("click", (e) => {
    const nav = e.target.closest("[data-tnav]");
    if (!nav) {
      if (e.target.closest(".t-item")) toast("This module is chrome only — Events is the prototype focus.");
      return;
    }
    if (nav.dataset.tnav === "dash") go("#/talent");
    if (nav.dataset.tnav === "events") go("#/talent/events");
    if (nav.dataset.tnav === "calendar") { ui.tCalView = "calendar"; go("#/talent/calendar"); }
    if (nav.dataset.tnav === "settings") go("#/talent/settings");
  });
  document.getElementById("dash-events-card").onclick = () => go("#/talent/events");
  document.querySelectorAll("[data-tnav]").forEach((b) => {
    if (b.closest("#talent-nav")) return;
    b.onclick = () => {
      if (b.dataset.tnav === "calendar") { ui.tCalView = "calendar"; go("#/talent/calendar"); }
