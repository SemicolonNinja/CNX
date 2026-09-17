function discoverEvents() {
  return db.events.filter((ev) => {
    if (ev.archived || ev.lifecycle === "Deleted") return false;
    if (!ev.discoverable) return false;
    if (ui.tLoc && ev.locationMode !== ui.tLoc) return false;
    if (!inDatePreset(ev, ui.tDate)) return false;
    const q = ui.tSearch.trim().toLowerCase();
    if (q && !(`${ev.name} ${ev.description || ""} ${ev.host || ""}`.toLowerCase().includes(q))) return false;
    return true;
  }).sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
}

function reservedEvents() {
  return db.events.filter((ev) => {
    if (ev.archived || ev.lifecycle === "Deleted") return false;
    return isReserved(ev);
  });
}

function talentCalCounts() {
  const c = { Upcoming: 0, Ongoing: 0, Ended: 0 };
  reservedEvents().forEach((ev) => { c[talentStatusOf(ev)] = (c[talentStatusOf(ev)] || 0) + 1; });
  return c;
}

function coverHtml(ev) {
  if (ev.cover === "quote-book") {
    return `<div class="t-cover quote">${ev.coverQuote ? `<p>“${escapeHtml(ev.coverQuote)}”</p><small>${escapeHtml(ev.coverCite || "")}</small>` : `<span>${initials(ev.name)}</span>`}</div>`;
  }
  if (ev.cover === "ui") {
    return `<div class="t-cover ui"><span class="t-cover-fake"></span></div>`;
  }
  return `<div class="t-cover initials"><span>${initials(ev.name)}</span></div>`;
}

function eventCardHtml(ev) {
  const host = ev.host || "Jamesbond Inc.";
  const hi = ev.hostInitial || host.charAt(0);
  return `<article class="t-event-card">
    ${coverHtml(ev)}
    <div class="t-event-body">
      <span class="t-cat">${escapeHtml(ev.category || "Category")}</span>
      <h3>${escapeHtml(ev.name)}</h3>
      <p class="t-meta"><span class="cal-ico"></span> ${escapeHtml(fmtCardWhen(ev))}</p>
      <p class="t-meta"><span class="pin-ico"></span> ${escapeHtml(ev.locationMode)}</p>
      <div class="t-event-foot">
        <span class="t-host"><i>${escapeHtml(hi)}</i> ${escapeHtml(host)}</span>
        <button class="text-link" type="button" data-te="${ev.id}">View ›</button>
      </div>
    </div>
  </article>`;
}

function renderTalentDash() {
  document.getElementById("dash-event-count").textContent = reservedEvents().length;
  document.getElementById("dash-today-date").textContent = NOW.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const today = reservedEvents().filter((ev) => {
    const s = new Date(ev.startAt);
    return s.toDateString() === NOW.toDateString();
  });
  const box = document.getElementById("dash-today-list");
  box.innerHTML = today.length
    ? today.map((ev) => `<button class="text-link" type="button" data-te="${ev.id}">${escapeHtml(ev.name)} · ${fmtDetailTime(ev.startAt)}</button>`).join("")
    : `<p class="hint">No reserved event today.</p>`;
  box.onclick = (e) => {
    const b = e.target.closest("[data-te]");
    if (b) go(`#/talent/event/${b.dataset.te}`);
  };
}

function goingEvents() {
  return db.events.filter((ev) => {
    if (ev.archived || ev.lifecycle === "Deleted") return false;
    const r = myReg(ev.id);
    if (!r || !["Going", "Checked in"].includes(r.status)) return false;
    const st = statusOf(ev);
    return st === "Upcoming" || st === "Ongoing";
  }).sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
}

function pastEvents() {
  return db.events.filter((ev) => {
    if (ev.archived && !myReg(ev.id)) return false;
    const r = myReg(ev.id);
    if (!r) return false;
    if (ev.lifecycle === "Cancelled" && ["Going", "Checked in", "Cancelled"].includes(r.status)) return true;
    return statusOf(ev) === "Ended" && ["Going", "Checked in", "No-show", "Cancelled"].includes(r.status);
  }).sort((a, b) => new Date(b.startAt) - new Date(a.startAt));
}

function renderTalentList() {
  const extra = (ui.route.extra || "discover").toLowerCase();
  ui.ttab = extra === "going" ? "Going" : extra === "past" ? "Past" : "Discover";
  document.querySelectorAll("#t-event-tabs [data-ttab]").forEach((t) => t.classList.toggle("active", t.dataset.ttab === ui.ttab));
  const lede = document.getElementById("t-list-lede");
  lede.textContent = ui.ttab === "Discover"
    ? "Discover festivals, meetups and workshops you can join"
    : ui.ttab === "Going"
      ? "Confirmed upcoming and live reservations"
      : "Ended events you reserved";
  const list = ui.ttab === "Going" ? goingEvents().filter((ev) => {
    if (ui.tLoc && ev.locationMode !== ui.tLoc) return false;
    if (!inDatePreset(ev, ui.tDate)) return false;
    const q = ui.tSearch.trim().toLowerCase();
    if (q && !(`${ev.name} ${ev.description || ""} ${ev.host || ""}`.toLowerCase().includes(q))) return false;
    return true;
  }) : ui.ttab === "Past" ? pastEvents().filter((ev) => {
    if (ui.tLoc && ev.locationMode !== ui.tLoc) return false;
    const q = ui.tSearch.trim().toLowerCase();
    if (q && !(`${ev.name} ${ev.host || ""}`.toLowerCase().includes(q))) return false;
    return true;
  }) : discoverEvents();
  const empty = document.getElementById("talent-empty");
  const cards = document.getElementById("talent-cards");
  if (!list.length) {
    empty.classList.remove("hidden");
    empty.innerHTML = ui.ttab === "Going"
      ? `<p>You’re not going to any upcoming events. <button class="text-link" type="button" id="empty-discover">Discover events</button>.</p>`
      : ui.ttab === "Past"
        ? `<p>No past reservations yet.</p>`
        : `<p>No events match these filters.</p>`;
    cards.innerHTML = "";
    document.getElementById("empty-discover")?.addEventListener("click", () => go("#/talent/events"));
    return;
  }
  empty.classList.add("hidden");
  cards.innerHTML = list.map(eventCardHtml).join("");
}

function renderTalentSettings() {
  const n = db.notify || { inApp: true, email: true, sms: false };
  document.getElementById("set-inapp").checked = !!n.inApp;
  document.getElementById("set-email").checked = !!n.email;
  document.getElementById("set-sms").checked = !!n.sms;
  document.getElementById("set-sms-hint").textContent = n.sms
    ? "SMS will send for invitations, reminders, and changes. Invalid numbers skip SMS; email still goes."
    : "SMS opted out. Email and in-app only.";
}

function talentCta(ev, r, st) {
  const ended = st === "Ended" || ev.lifecycle === "Cancelled";
  const reserved = r && ["Going", "Checked in"].includes(r.status);
  const virtual = ev.locationMode === "Virtual" || ev.locationMode === "Hybrid";
  const join = joinInfo(ev, r);
  const door = doorState(ev);
  const copy = `<button class="btn btn-ghost" type="button" id="t-copy" ${ended || ev.copyDisabled ? "disabled" : ""}>Copy link</button>`;
  if (ended) {
    const attended = r && (r.status === "Checked in" || r.joined);
    const feedback = attended && !r.feedback
      ? `<button class="btn btn-primary" type="button" id="t-feedback">Leave feedback</button>`
      : attended
        ? `<button class="btn btn-reserved" type="button" disabled>Feedback sent</button>`
        : `<button class="btn btn-reserved" type="button" disabled>${ev.lifecycle === "Cancelled" ? "Cancelled" : "Reserved"}</button>`;
    return `${feedback}${copy}`;
  }
  if (r?.status === "Invited") {
    return `<button class="btn btn-primary" type="button" id="t-accept">Accept invitation</button>${copy}`;
  }
  if (r?.status === "Unpaid") {
    return `<button class="btn btn-primary" type="button" id="t-pay">Pay ₦${ev.price}</button>${copy}`;
  }
  if (r?.status === "Pending") {
    return `<button class="btn btn-reserved" type="button" disabled>Requested</button>${copy}`;
  }
  if (r?.status === "Waitlisted") {
    return `<button class="btn btn-reserved" type="button" disabled>Waitlisted</button>${copy}`;
  }
  if (reserved) {
    const primary = (join.kind === "live" && virtual)
      ? `<button class="btn btn-primary" type="button" id="t-join">Join event</button>`
      : `<button class="btn btn-reserved" type="button" disabled>You’re going</button>`;
    return `${primary}
      <button class="btn btn-ghost" type="button" id="t-cancel">Cancel reservation</button>
      <button class="btn btn-ghost" type="button" id="t-ticket">View ticket</button>
      ${copy}`;
  }
  if (door.kind === "opens") {
    return `<button class="btn btn-reserved" type="button" disabled>Opens later</button>${copy}`;
  }
  if (door.kind === "closed") {
    return `<button class="btn btn-reserved" type="button" disabled>Registration closed</button>${copy}`;
  }
  if (door.kind === "full" || door.kind === "full-wait") {
    return ev.waitlist
      ? `<button class="btn btn-primary" type="button" id="t-wait">Join waitlist</button>${copy}`
      : `<button class="btn btn-reserved" type="button" disabled>Event full</button>${copy}`;
  }
  if (ev.approval) {
    return `<button class="btn btn-primary" type="button" id="t-reserve">Request to join</button>${copy}`;
  }
  return `<button class="btn btn-primary" type="button" id="t-reserve">Reserve a spot</button>${copy}`;
}

function renderTalentEvent() {
  const ev = eventBy(ui.route.id);
  const root = document.getElementById("view-talent-event");
  if (!ev) {
    root.innerHTML = `<p class="hint">This event isn’t available.</p>`;
    return;
  }
  const r = myReg(ev.id);
  const reserved = isReserved(ev);
  const st = statusOf(ev);
  const ended = st === "Ended" || ev.lifecycle === "Cancelled";
  const statusLabel = ended ? "Closed" : st;
  const statusClass = ended ? "closed" : (st === "Ongoing" ? "on" : "up");
  const virtual = ev.locationMode === "Virtual" || ev.locationMode === "Hybrid";
  const locLabel = ev.locationMode === "Virtual" ? "Online" : ev.locationMode;
  const locBody = virtual
    ? `<button class="text-link meet-link" type="button" id="t-meet">Enum meet</button>`
    : `<strong>${escapeHtml(ev.place || ev.locationMode)}</strong>`;
  const host = ev.host || "Jamesbond Inc.";
  const hi = ev.hostInitial || host.charAt(0);
  const published = ev.publishedOn ? fmtDetailDay(ev.publishedOn).replace(/^\w+, /, "") : fmtDetailDay(ev.startAt).replace(/^\w+, /, "");
