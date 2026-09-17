  const visIcon = ev.visibility === "Private" ? lock() : globe();
  const tags = (ev.tags || []).map((t) => `<span class="chip">${escapeHtml(t)}</span>`).join("");
  const cap = ev.capacity ? `<p class="hint">${Math.max(0, Number(ev.capacity) - goingCount(ev))} spots left</p>` : "";
  const join = joinInfo(ev, r);
  const door = doorState(ev);
  const guestsHtml = guestListHtml(ev, r);
  const notes = publishedNotesHtml(ev, r);
  const cancelledBanner = ev.lifecycle === "Cancelled"
    ? `<p class="banner">This event has been cancelled.${r?.eventCancelled ? " You were Going — the ticket is void and Join is closed." : ""}</p>`
    : "";
  const doorHint = !reserved && !ended && door.msg ? `<p class="hint">${escapeHtml(door.msg)}</p>` : "";
  root.innerHTML = `
    <p class="t-crumb"><button type="button" id="back-talent">Events</button> / <span>${escapeHtml(ev.name)}</span></p>
    <div class="t-detail">
      ${coverHtml(ev)}
      <div class="t-detail-main">
        <article class="card pad t-title-card">
          ${cancelledBanner}
          <div class="t-title-row">
            <div>
              <h1>${visIcon} ${escapeHtml(ev.name)} <span class="status-pill ${statusClass}">${statusLabel}</span></h1>
              <p class="hint">${escapeHtml(ev.category || "")}</p>
              <p class="hint">by ${escapeHtml(host)} on ${escapeHtml(published)}</p>
            </div>
            <div class="t-title-actions">
              ${talentCta(ev, r, st)}
            </div>
          </div>
          ${cap}
          ${doorHint}
          ${reserved && join.kind !== "live" && !ended ? `<p class="hint">${escapeHtml(join.msg)}</p>` : ""}
          ${guestsHtml}
        </article>
        <div class="t-detail-meta">
          <article class="card pad">
            <p class="hint">Start date/time</p>
            <strong>${fmtDetailDay(ev.startAt)}</strong>
            <p>${fmtDetailTime(ev.startAt)}</p>
            <p class="hint" style="margin-top:12px">End date/time</p>
            <strong>${fmtDetailDay(ev.endAt)}</strong>
            <p>${fmtDetailTime(ev.endAt)}</p>
          </article>
          <article class="card pad">
            <p class="hint">${locLabel}</p>
            ${locBody}
          </article>
        </div>
      </div>
    </div>
    <div class="t-detail-lower">
      <article class="card pad">
        <h3>Host</h3>
        <p class="t-host"><i>${escapeHtml(hi)}</i> ${escapeHtml(host)}</p>
        ${tags ? `<h3 style="margin-top:16px">Tags</h3><div class="chips">${tags}</div>` : ""}
      </article>
      ${ev.description ? `<article class="card pad"><h3>Description</h3><p>${escapeHtml(ev.description)}</p></article>` : `<div></div>`}
      ${notes}
    </div>`;
  document.getElementById("back-talent").onclick = () => go(reserved ? "#/talent/events/going" : "#/talent/events");
  document.getElementById("t-reserve")?.addEventListener("click", () => openReserveModal(ev, false));
  document.getElementById("t-wait")?.addEventListener("click", () => openReserveModal(ev, true));
  document.getElementById("t-accept")?.addEventListener("click", () => {
    r.status = ev.ticket === "paid" ? "Unpaid" : "Going";
    r.ticket = r.ticket || ticketCode();
    save(); toast("You’re going. This is on your Enum calendar."); render();
  });
  document.getElementById("t-pay")?.addEventListener("click", () => {
    r.paid = true; r.status = "Going"; save(); toast("Successfully registered for event"); render();
  });
  document.getElementById("t-cancel")?.addEventListener("click", () => cancelMine(ev, r));
  document.getElementById("t-ticket")?.addEventListener("click", () => showTicket(ev, r));
  document.getElementById("t-feedback")?.addEventListener("click", () => openFeedback(ev, r));
  document.getElementById("t-hide-guest")?.addEventListener("click", () => {
    r.hideOnGuestList = true; save(); toast("You won’t appear on the guest list."); render();
  });
  document.getElementById("t-copy")?.addEventListener("click", () => {
    if (ended || ev.copyDisabled) return;
    const url = `${location.origin}${location.pathname}#/talent/event/${ev.id}`;
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url);
    toast("Link copied!");
  });
  const tryJoin = () => attemptJoin(ev, r, false);
  document.getElementById("t-meet")?.addEventListener("click", tryJoin);
  document.getElementById("t-join")?.addEventListener("click", tryJoin);
}

function guestListHtml(ev, r) {
  if (ev.privacy === "hidden") return "";
  const guests = publicGuests(ev);
  if (ev.privacy === "count") return `<div class="guest-box"><p class="hint">${goingCount(ev)} going.</p></div>`;
  const avatars = guests.map((g) => `<i title="${escapeHtml(person(g.personId).name)}">${person(g.personId).initials}</i>`).join("");
  const opt = r && ["Going", "Checked in"].includes(r.status) && !r.hideOnGuestList
    ? `<button class="text-link" type="button" id="t-hide-guest">Don’t show me on the guest list</button>`
    : (r?.hideOnGuestList ? `<p class="hint">You won’t appear on the guest list.</p>` : "");
  return `<div class="guest-box"><p class="hint">${goingCount(ev)} going</p><div class="guest-avatars">${avatars || ""}</div>${opt}</div>`;
}

function publishedNotesHtml(ev, r) {
  const s = db.summary[ev.id];
  const ended = statusOf(ev) === "Ended";
  if (!ended) return "";
  if (!s || s.status !== "published") {
    if (r && (r.joined || r.status === "Checked in")) {
      return `<article class="card pad notes-card"><h3>Session notes</h3><p class="hint">The host hasn’t shared notes from this session yet.</p></article>`;
    }
    return "";
  }
  return `<article class="card pad notes-card"><h3>Session notes</h3><p>${escapeHtml(s.summary)}</p>
    <h3>Key details</h3><ul>${s.key_details.map((k) => `<li>${escapeHtml(k)}</li>`).join("")}</ul></article>`;
}

function attemptJoin(ev, r, host) {
  if (host) {
    ev.roomOpen = true;
    db.meet.host = true;
    db.meet.eventId = ev.id;
    db.meet.admitted = db.meet.admitted || {};
    db.meet.admitted[db.talentId] = true;
    save();
    go(`#/meet/${ev.id}`);
    return;
  }
  const join = joinInfo(ev, r);
  if (join.kind === "blocked") {
    if (r?.status === "Unpaid") {
      document.getElementById("paywall-copy").textContent = "Payment is incomplete, so you can’t join yet.";
      document.getElementById("paywall-overlay").classList.remove("hidden");
      ui.pendingReserve = { id: ev.id, pay: true };
      return;
    }
    toast(join.msg);
    return;
  }
  if (join.kind === "early" || join.kind === "host" || join.kind === "ended") {
    toast(join.msg);
    return;
  }
  db.meet.host = false;
  db.meet.eventId = ev.id;
  db.meet.waiting = !!(ev.waitingRoom && !db.meet.admitted?.[db.talentId]);
  save();
  go(`#/meet/${ev.id}`);
}

function openFeedback(ev, r) {
  if (!r || !(r.status === "Checked in" || r.joined)) {
    toast("Feedback opens after you attend.");
    return;
  }
  ui.pendingReserve = { id: ev.id, feedback: true };
  document.getElementById("feedback-overlay").classList.remove("hidden");
}

function openReserveModal(ev, wait) {
  const door = doorState(ev);
  if (!wait && (door.kind === "closed" || door.kind === "opens" || door.kind === "full")) {
    toast(door.msg);
    return;
  }
  ui.pendingReserve = { id: ev.id, wait };
  document.getElementById("reserve-copy").textContent = wait
    ? `This event is full. Join the waitlist for ${ev.name}?`
    : ev.approval
      ? `Request to join ${ev.name}? You’ll hear when the host decides.`
      : `Reserve a spot for ${ev.name}? This adds it to your Enum calendar.`;
  const qwrap = document.getElementById("reserve-questions");
  qwrap.innerHTML = (ev.questions || []).map(questionFieldHtml).join("");
  document.getElementById("reserve-overlay").classList.remove("hidden");
}

function closeReserveModal() {
  document.getElementById("reserve-overlay").classList.add("hidden");
  ui.pendingReserve = null;
}

function commitReserve() {
  const pending = ui.pendingReserve;
  if (!pending) return;
  const ev = eventBy(pending.id);
  if (ev.questions?.some((q) => q.required && !questionAnswered(q))) {
    toast("Answer the required questions to reserve.");
    return;
  }
  const door = doorState(ev);
  if (!pending.wait && door.kind === "full") { toast("This event just filled."); return; }
  if (door.kind === "closed") { toast("Registration is closed."); return; }
  if (door.kind === "opens") { toast(door.msg); return; }
  const existing = myReg(ev.id);
  const status = ev.approval ? "Pending" : (pending.wait ? "Waitlisted" : (ev.ticket === "paid" ? "Unpaid" : "Going"));
  if (existing) {
    existing.status = status;
    existing.ticket = existing.ticket || ticketCode();
    existing.paid = ev.ticket !== "paid";
  } else {
    db.registrations.push({
      id: "r" + Date.now(), eventId: ev.id, personId: db.talentId,
      status, source: "link", ticket: ticketCode(), paid: ev.ticket !== "paid", joined: false
    });
  }
  save();
  closeReserveModal();
  toast("Successfully registered for event");
  if (status === "Going") {
    document.getElementById("reserve-ok-copy").textContent = `${ev.name} has been added to your calendar.`;
    ui.pendingReserve = { id: ev.id };
    document.getElementById("reserve-ok-overlay").classList.remove("hidden");
  }
  render();
}

function reserveSpot(ev) {
  openReserveModal(ev, false);
}

function renderTalentCalendar() {
  const gridOn = ui.tCalView === "grid" || ui.route.extra === "grid";
  if (ui.route.extra === "grid") ui.tCalView = "grid";
  document.getElementById("t-cal-grid-wrap").classList.toggle("hidden", !gridOn);
  document.getElementById("t-cal-layout").classList.toggle("hidden", gridOn);
  document.querySelector(".t-cal-bar").classList.toggle("hidden", gridOn);
  document.getElementById("t-btn-grid").classList.toggle("active", gridOn);
  document.getElementById("t-btn-cal").classList.toggle("active", !gridOn);
  document.getElementById("t-btn-grid-2").classList.toggle("active", gridOn);
