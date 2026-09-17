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
