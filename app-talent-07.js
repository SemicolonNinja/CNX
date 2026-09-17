      if (b.dataset.tnav === "events") go("#/talent/events");
    };
  });
  document.getElementById("talent-cards").addEventListener("click", (e) => {
    const b = e.target.closest("[data-te]");
    if (b) go(`#/talent/event/${b.dataset.te}`);
  });
  document.getElementById("t-cal-cards").addEventListener("click", (e) => {
    const b = e.target.closest("[data-te]");
    if (b) go(`#/talent/event/${b.dataset.te}`);
  });
  document.getElementById("t-cal-month").addEventListener("click", (e) => {
    const b = e.target.closest("[data-te]");
    if (b) go(`#/talent/event/${b.dataset.te}`);
  });
  document.getElementById("t-year-wrap").addEventListener("click", (e) => {
    const b = e.target.closest("[data-te]");
    if (b) go(`#/talent/event/${b.dataset.te}`);
  });
  document.getElementById("t-search").oninput = (e) => { ui.tSearch = e.target.value; render(); };
  document.getElementById("t-filter-btn").onclick = (ev) => {
    ev.stopPropagation();
    document.getElementById("t-filter-menu").classList.toggle("hidden");
  };
  document.querySelectorAll("[data-tsub]").forEach((b) => {
    b.onmouseenter = () => {
      document.querySelectorAll("#t-filter-menu .submenu").forEach((el) => el.classList.add("hidden"));
      document.getElementById("t-sub-" + b.dataset.tsub).classList.remove("hidden");
    };
  });
  document.querySelectorAll("[data-tloc]").forEach((b) => b.onclick = () => {
    ui.tLoc = ui.tLoc === b.dataset.tloc ? "" : b.dataset.tloc; render();
  });
  document.querySelectorAll("[data-tdate]").forEach((b) => b.onclick = () => {
    ui.tDate = ui.tDate === b.dataset.tdate ? "" : b.dataset.tdate; render();
  });
  document.querySelectorAll("[data-tstat]").forEach((t) => t.onclick = () => {
    ui.tCalTab = t.dataset.tstat;
    ui.tCalView = "grid";
    go("#/talent/calendar/events");
    render();
  });
  document.getElementById("tc-search").oninput = (e) => { ui.tCalSearch = e.target.value; render(); };
  document.getElementById("tc-filter-btn").onclick = (ev) => {
    ev.stopPropagation();
    document.getElementById("tc-filter-menu").classList.toggle("hidden");
  };
  document.querySelectorAll("[data-tcsub]").forEach((b) => {
    b.onmouseenter = () => {
      document.querySelectorAll("#tc-filter-menu .submenu").forEach((el) => el.classList.add("hidden"));
      document.getElementById("tc-sub-" + b.dataset.tcsub).classList.remove("hidden");
    };
  });
  document.querySelectorAll("[data-tcloc]").forEach((b) => b.onclick = () => {
    ui.tCalLoc = ui.tCalLoc === b.dataset.tcloc ? "" : b.dataset.tcloc; render();
  });
  document.querySelectorAll("[data-tcdate]").forEach((b) => b.onclick = () => {
    ui.tCalDate = ui.tCalDate === b.dataset.tcdate ? "" : b.dataset.tcdate; render();
  });
  document.getElementById("t-btn-grid").onclick = () => { ui.tCalView = "grid"; go("#/talent/calendar/events"); render(); };
  document.getElementById("t-btn-cal").onclick = () => { ui.tCalView = "calendar"; go("#/talent/calendar"); render(); };
  document.getElementById("t-btn-grid-2").onclick = () => { ui.tCalView = "grid"; go("#/talent/calendar/events"); render(); };
  document.getElementById("t-btn-cal-2").onclick = () => { ui.tCalView = "calendar"; go("#/talent/calendar"); render(); };
  document.getElementById("t-cal-mode").onchange = (e) => { ui.tCalMode = e.target.value; ui.tCalView = "calendar"; render(); };
  document.getElementById("t-cal-prev").onclick = () => {
    const d = ui.tCalCursor;
    if (ui.tCalMode === "day") d.setDate(d.getDate() - 1);
    if (ui.tCalMode === "week") d.setDate(d.getDate() - 7);
    if (ui.tCalMode === "month") d.setMonth(d.getMonth() - 1);
    if (ui.tCalMode === "year") d.setFullYear(d.getFullYear() - 1);
    render();
  };
  document.getElementById("t-cal-next").onclick = () => {
    const d = ui.tCalCursor;
    if (ui.tCalMode === "day") d.setDate(d.getDate() + 1);
    if (ui.tCalMode === "week") d.setDate(d.getDate() + 7);
    if (ui.tCalMode === "month") d.setMonth(d.getMonth() + 1);
    if (ui.tCalMode === "year") d.setFullYear(d.getFullYear() + 1);
    render();
  };
  document.getElementById("t-today").onclick = () => { ui.tCalCursor = new Date(NOW); render(); };

  document.getElementById("meet-leave").onclick = () => go(`#/talent/event/${ui.route.id}`);
  document.getElementById("waiting-leave").onclick = () => go(`#/talent/event/${ui.route.id}`);
  document.getElementById("waiting-admit").onclick = () => {
    db.meet.admitted = db.meet.admitted || {};
    db.meet.admitted[db.talentId] = true;
    db.meet.waiting = false;
    save(); render();
  };
  document.getElementById("meet-record").onclick = () => { db.meet.recording = !db.meet.recording; save(); render(); };
  document.getElementById("meet-lock").onclick = () => { db.meet.locked = !db.meet.locked; toast(db.meet.locked ? "Room locked." : "Room unlocked."); };
  document.getElementById("meet-hand").onclick = () => { db.meet.hand = !db.meet.hand; save(); render(); };
  document.getElementById("meet-cam").onclick = () => {
    if (db.meet.cam) { db.meet.cam = false; db.meet.avError = ""; }
    else { db.meet.cam = true; db.meet.avError = ""; }
    save(); render();
  };
  document.getElementById("meet-mic").onclick = () => {
    db.meet.mic = !db.meet.mic;
    db.meet.avError = db.meet.mic ? "" : "Allow microphone to be heard, or join muted.";
    save(); render();
  };
  document.getElementById("meet-share").onclick = () => { db.meet.share = !db.meet.share; save(); render(); };
  document.getElementById("meet-breakout").onclick = () => {
    db.meet.breakoutsOpen = !db.meet.breakoutsOpen;
    save(); render();
  };
  document.getElementById("bo-open").onclick = () => {
    const n = Math.max(1, Math.min(6, Number(document.getElementById("bo-count").value || 2)));
    const joiners = regsFor(ui.route.id).filter((r) => r.joined).map((r) => r.personId);
    db.meet.breakouts = Array.from({ length: n }, (_, i) => ({
      name: `Breakout ${String.fromCharCode(65 + i)}`,
      members: i === 0 ? joiners.slice(0, Math.ceil(joiners.length / n)) : (i === 1 ? joiners.slice(Math.ceil(joiners.length / n)) : [])
    }));
    db.meet.breakoutsOpen = true;
    const ev = eventBy(ui.route.id);
    if (ev) ev.hadBreakouts = true;
    save(); render();
  };
  document.getElementById("bo-close").onclick = () => {
    db.meet.breakoutsOpen = false;
    toast("Returned to the main room.");
    save(); render();
  };
  document.getElementById("meet-roster").addEventListener("click", (e) => {
    const kick = e.target.closest("[data-kick]");
    if (kick) {
      const r = regsFor(ui.route.id).find((x) => x.personId === kick.dataset.kick);
      if (r) { r.joined = false; toast("You’ve been removed from this session."); save(); render(); }
    }
    const mute = e.target.closest("[data-mute]");
    if (mute) {
      const r = db.registrations.find((x) => x.id === mute.dataset.mute) || regsFor(ui.route.id).find((x) => x.personId === mute.dataset.mute);
      if (r) { r.muted = true; save(); render(); }
    }
  });
  document.getElementById("meet-end").onclick = () => {
    const ev = eventBy(ui.route.id);
    ev.roomOpen = false;
    db.meet.recording = false;
    db.meet.waiting = false;
    save();
    go(`#/edu/event/${ev.id}/grouping`);
  };
  document.getElementById("meet-send").onclick = () => {
    const text = document.getElementById("meet-msg").value.trim();
    if (!text) return;
    db.meet.chats = db.meet.chats || [];
    db.meet.chats.push({ who: "James Bond", text });
    document.getElementById("meet-msg").value = "";
    save(); render();
  };

  document.getElementById("confirm-no").onclick = () => document.getElementById("confirm-overlay").classList.add("hidden");
  document.getElementById("confirm-x").onclick = () => document.getElementById("confirm-overlay").classList.add("hidden");
  document.getElementById("confirm-yes").onclick = () => {
    document.getElementById("confirm-overlay").classList.add("hidden");
    const fn = ui.confirm; ui.confirm = null; fn && fn();
  };
  document.getElementById("ticket-x").onclick = () => document.getElementById("ticket-overlay").classList.add("hidden");
  const closeReserveOk = () => document.getElementById("reserve-ok-overlay").classList.add("hidden");
  document.getElementById("reserve-x").onclick = closeReserveModal;
  document.getElementById("reserve-no").onclick = closeReserveModal;
  document.getElementById("reserve-yes").onclick = commitReserve;
  document.getElementById("reserve-overlay").addEventListener("click", (e) => { if (e.target.id === "reserve-overlay") closeReserveModal(); });
  document.getElementById("reserve-ok-x").onclick = closeReserveOk;
  document.getElementById("reserve-ok-done").onclick = closeReserveOk;
  document.getElementById("reserve-ok-cal").onclick = () => { closeReserveOk(); ui.tCalView = "grid"; ui.tCalTab = "Upcoming"; go("#/talent/calendar/events"); };
  document.getElementById("reserve-ok-ics").onclick = () => {
    const ev = eventBy(ui.pendingReserve?.id || ui.route.id);
    const r = ev && myReg(ev.id);
    if (ev && r) downloadIcs(ev, r);
  };
  document.getElementById("reserve-ok-gcal").onclick = () => toast("Opens Google Calendar with the same times as the .ics.");
  document.getElementById("reserve-ok-apple").onclick = () => {
    const ev = eventBy(ui.pendingReserve?.id || ui.route.id);
    const r = ev && myReg(ev.id);
    if (ev && r) downloadIcs(ev, r);
  };
  document.getElementById("reserve-ok-outlook").onclick = () => toast("Opens Outlook with the same times as the .ics.");
  document.getElementById("t-event-tabs")?.addEventListener("click", (e) => {
    const t = e.target.closest("[data-ttab]");
    if (!t) return;
    const tab = t.dataset.ttab.toLowerCase();
    go(tab === "discover" ? "#/talent/events" : `#/talent/events/${tab}`);
  });
  document.getElementById("t-subscribe").onclick = () => {
    const url = db.calendarUrl;
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url);
    toast("Host calendar link copied. Subscribe in Google / Apple / Outlook — it stays current when the organiser edits.");
