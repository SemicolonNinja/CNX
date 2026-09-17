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
