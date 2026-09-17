  const p = person(r.personId);
  const voided = r.status === "Cancelled" || ev.lifecycle === "Cancelled";
  document.getElementById("ticket-body").innerHTML = `
    <div class="ticket ${voided ? "void" : ""}">
      <div class="qr">${qrSvg(r.ticket || "VOID")}</div>
      <h3>${escapeHtml(p.name)}</h3>
      <p>${escapeHtml(ev.name)}</p>
      <p>${fmtWhen(ev.startAt)}</p>
      <p>${voided ? "VOID — this ticket was cancelled." : r.status}</p>
      <code>${escapeHtml(r.ticket || "")}</code>
    </div>`;
  document.getElementById("ticket-overlay").classList.remove("hidden");
}

function qrSvg(text) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  let rects = "";
  for (let y = 0; y < 11; y++) for (let x = 0; x < 11; x++) {
    const on = ((h >> ((x + y * 3) % 24)) & 1) || x < 2 || y < 2 || x > 8 || y > 8;
    if (on && !(x > 2 && x < 8 && y > 2 && y < 8 && (x + y) % 2 === 0)) {
      rects += `<rect x="${x * 8}" y="${y * 8}" width="7" height="7" fill="#111"/>`;
    }
  }
  return `<svg width="88" height="88" viewBox="0 0 88 88">${rects}</svg>`;
}

/* ---------- meet / community ---------- */
function renderMeet() {
  const ev = eventBy(ui.route.id);
  if (!ev) return go("#/edu");
  const host = !!db.meet.host;
  const waiting = !host && !!(ev.waitingRoom && db.meet.waiting && !db.meet.admitted?.[db.talentId]);
  document.getElementById("waiting-room").classList.toggle("hidden", !waiting);
  document.getElementById("meet-live").classList.toggle("hidden", waiting);
  document.getElementById("meet-title").textContent = ev.name;
  if (waiting) {
    document.getElementById("waiting-copy").textContent = "The host will let you in when they are ready.";
    document.getElementById("waiting-admit").classList.remove("hidden");
    document.getElementById("waiting-admit").textContent = host ? "Admit James" : "Admit (host)";
    return;
  }
  const reg = myReg(ev.id);
  if (!host && reg && ["Going", "Checked in"].includes(reg.status)) reg.joined = true;
  db.meet.cam = db.meet.cam !== false;
  db.meet.mic = db.meet.mic !== false;
  db.meet.share = !!db.meet.share;
  db.meet.hand = !!db.meet.hand;
  document.getElementById("meet-rec").textContent = db.meet.recording ? "Recording" : "Not recording";
  document.getElementById("meet-cam").textContent = db.meet.cam ? "Camera on" : "Camera off";
  document.getElementById("meet-mic").textContent = db.meet.mic ? "Mic on" : "Mic off";
  document.getElementById("meet-share").textContent = db.meet.share ? "Sharing" : "Share screen";
  document.getElementById("meet-av-hint").textContent = db.meet.avError || "";
  document.getElementById("meet-hand").textContent = db.meet.hand ? "Hand raised" : "Raise hand";
  const onCall = regsFor(ev.id).filter((r) => r.joined);
  if (host && !onCall.some((r) => r.personId === "p-ada")) {
    /* host is Ada in educator seed; still show tiles from joiners */
  }
  if (!onCall.length) {
    onCall.push({ personId: db.talentId, joined: true });
    const mine = myReg(ev.id);
    if (mine) mine.joined = true;
  }
  save();
  document.getElementById("meet-stage").innerHTML = onCall.map((r) => {
    const p = person(r.personId) || PEOPLE[0];
    return `<div class="tile"><div class="av">${p.initials}</div><span>${escapeHtml(p.name)}${r.muted ? " · muted" : ""}</span></div>`;
  }).join("");
  document.getElementById("meet-roster").innerHTML = onCall.map((r) => {
    const p = person(r.personId) || PEOPLE[0];
    const kick = host ? `<button class="text-link" type="button" data-kick="${r.personId}">Remove</button> <button class="text-link" type="button" data-mute="${r.id || r.personId}">Mute</button>` : "";
    return `<p>${escapeHtml(p.name)} ${kick}</p>`;
  }).join("");
  document.getElementById("meet-chat").innerHTML = (db.meet.chats || []).map((c) => `<p><strong>${escapeHtml(c.who)}</strong> ${escapeHtml(c.text)}</p>`).join("");
  const bo = document.getElementById("breakout-panel");
  bo.classList.toggle("hidden", !db.meet.breakoutsOpen);
  if (db.meet.breakoutsOpen) {
    const rooms = db.meet.breakouts || [];
    document.getElementById("bo-rooms").innerHTML = rooms.map((room, i) =>
      `<p><strong>${escapeHtml(room.name)}</strong> — ${(room.members || []).map((id) => person(id)?.name || id).join(", ") || "empty (no Community group)"}</p>`
    ).join("") || `<p class="hint">No rooms yet.</p>`;
  }
}

function renderCommunity() {
  const el = document.getElementById("community-groups");
  if (!db.groups.length) {
    el.innerHTML = `<article class="card pad">No groups from calls yet. End a Meet session and run the grouping wizard.</article>`;
    return;
  }
  el.innerHTML = db.groups.map((g) => `
    <article class="card pad">
      <h3>${escapeHtml(g.name)}</h3>
      <p>${g.members.map((id) => person(id)?.name || id).join(", ")}</p>
      <p class="hint">Chat policy: ${g.chat}</p>
    </article>`).join("");
}

/* ---------- create/edit ---------- */
function openModal(editId) {
  ui.editingId = editId || null;
  document.getElementById("overlay").classList.remove("hidden");
  document.getElementById("modal-title").textContent = editId ? "Edit event" : "Create event";
  document.getElementById("submit-btn").textContent = editId ? "Save" : "Create event";
  const ev = editId ? eventBy(editId) : null;
  setVis(ev?.visibility || "Public");
  document.getElementById("f-name").value = ev?.name || "";
  document.getElementById("f-cat").value = ev?.category || "";
  document.getElementById("f-desc").value = ev?.description || "";
  document.getElementById("f-start").value = ev?.startAt || "";
  document.getElementById("f-end").value = ev?.endAt || "";
  setLoc(ev?.locationMode || "Physical");
  document.getElementById("f-place").value = ev?.place || "";
  document.getElementById("f-url").value = ev?.meetingUrl || "";
  document.getElementById("f-guest").value = "";
  document.getElementById("guest-chips").innerHTML = (ev?.guests || []).map((g) => `<span class="chip" data-g="${escapeHtml(g)}">${escapeHtml(g)} ×</span>`).join("");
  document.getElementById("f-remind").value = ev?.reminders || "None";
  document.getElementById("f-host").checked = !!ev?.enumHostsMeeting;
  document.getElementById("f-cap").value = ev?.capacity || "";
  document.getElementById("f-privacy").value = ev?.privacy || "hidden";
  document.getElementById("f-approval").checked = !!ev?.approval;
  document.getElementById("f-waitlist").checked = !!ev?.waitlist;
  document.getElementById("f-ticket").value = ev?.ticket || "free";
  document.getElementById("f-price").value = ev?.price || "";
  document.getElementById("price-wrap").classList.toggle("hidden", (ev?.ticket || "free") !== "paid");
  document.getElementById("f-sms").value = ev?.sms || "Off — email and in-app only";
  document.getElementById("f-regwin").value = ev?.regWindow || "open";
  document.getElementById("f-opens").value = ev?.opensAt || "";
  document.getElementById("opens-wrap").classList.toggle("hidden", (ev?.regWindow || "open") !== "opens");
  document.getElementById("f-early").checked = !!ev?.earlyEntry;
  document.getElementById("f-waiting").checked = !!ev?.waitingRoom;
  document.getElementById("f-series").value = ev?.series || "";
  ui.draftQuestions = (ev?.questions || []).map((q) => ({ ...q }));
  renderQuestionBuilder();
  document.getElementById("remind-preview").textContent = previewReminder(ev);
  document.getElementById("preview").src = ev?.image || "";
  document.getElementById("preview").classList.toggle("hidden", !ev?.image);
  validate();
}

function previewReminder(ev) {
  const when = ev?.startAt ? fmtWhen(ev.startAt) : "[time TZ]";
  return `Email: ${ev?.name || "Event"} · ${when}. SMS (if opted in): short name + time; Join URL only if Going.`;
}

function renderQuestionBuilder() {
  const el = document.getElementById("q-builder");
  if (!el) return;
  if (!ui.draftQuestions.length) {
    el.innerHTML = `<p class="hint">No extra questions. Add short, long, single, multiple, or acknowledgement.</p>`;
    return;
  }
  el.innerHTML = ui.draftQuestions.map((q, i) => `
    <div class="q-row" data-qi="${i}">
      <input data-q="label" value="${escapeHtml(q.label || "")}" placeholder="Question" />
      <select data-q="type">
        <option value="short"${q.type === "short" ? " selected" : ""}>Short</option>
        <option value="long"${q.type === "long" ? " selected" : ""}>Long</option>
        <option value="single"${q.type === "single" ? " selected" : ""}>Single</option>
        <option value="multi"${q.type === "multi" ? " selected" : ""}>Multiple</option>
        <option value="ack"${q.type === "ack" ? " selected" : ""}>Acknowledgement</option>
      </select>
      <label class="switch">Req <input type="checkbox" data-q="req"${q.required ? " checked" : ""} /><span class="slider"></span></label>
      <button class="btn btn-ghost" type="button" data-q="up">↑</button>
      <button class="btn btn-ghost" type="button" data-q="down">↓</button>
      <button class="btn btn-ghost" type="button" data-q="del">×</button>
      ${q.type === "single" || q.type === "multi" ? `<input data-q="options" value="${escapeHtml(q.options || "")}" placeholder="Options, comma separated" style="grid-column:1/-1" />` : ""}
    </div>`).join("");
}

function syncDraftQuestions() {
  document.querySelectorAll("#q-builder .q-row").forEach((row) => {
    const i = Number(row.dataset.qi);
    const q = ui.draftQuestions[i];
    if (!q) return;
    q.label = row.querySelector('[data-q="label"]')?.value || "";
    q.type = row.querySelector('[data-q="type"]')?.value || "short";
    q.required = !!row.querySelector('[data-q="req"]')?.checked;
    q.options = row.querySelector('[data-q="options"]')?.value || q.options || "";
  });
}

function guestsFromChips() {
  return [...document.querySelectorAll("#guest-chips .chip")].map((c) => c.dataset.g);
}
function setVis(v) {
  document.querySelectorAll(".seg-vis button").forEach((b) => b.classList.toggle("on", b.dataset.v === v));
}
function setLoc(v) {
