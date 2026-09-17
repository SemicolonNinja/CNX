  document.getElementById("t-btn-cal-2").classList.toggle("active", !gridOn);
  const c = talentCalCounts();
  document.getElementById("tc-up").textContent = c.Upcoming;
  document.getElementById("tc-on").textContent = c.Ongoing;
  document.getElementById("tc-en").textContent = c.Ended;
  document.querySelectorAll("[data-tstat]").forEach((t) => t.classList.toggle("active", t.dataset.tstat === ui.tCalTab));
  if (gridOn) {
    const list = reservedEvents().filter((ev) => {
      if (talentStatusOf(ev) !== ui.tCalTab) return false;
      if (ui.tCalLoc && ev.locationMode !== ui.tCalLoc) return false;
      if (!inDatePreset(ev, ui.tCalDate)) return false;
      const q = ui.tCalSearch.trim().toLowerCase();
      if (q && !(`${ev.name} ${ev.host || ""}`.toLowerCase().includes(q))) return false;
      return true;
    });
    const empty = document.getElementById("t-cal-empty");
    const cards = document.getElementById("t-cal-cards");
    if (!list.length) {
      empty.classList.remove("hidden");
      empty.innerHTML = `<p>No ${ui.tCalTab.toLowerCase()} events.</p>`;
      cards.innerHTML = "";
    } else {
      empty.classList.add("hidden");
      cards.innerHTML = list.map(eventCardHtml).join("");
    }
    return;
  }
  const mode = ui.tCalMode;
  document.getElementById("t-cal-mode").value = mode;
  const cur = ui.tCalCursor;
  let label = "";
  if (mode === "day") label = cur.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
  if (mode === "week") label = weekRangeLabel(startOfWeekMon(cur));
  if (mode === "month") label = cur.toLocaleString("en-US", { month: "long", year: "numeric" });
  if (mode === "year") label = String(cur.getFullYear());
  document.getElementById("t-range-label").textContent = label;
  const timed = mode === "week" || mode === "day";
  document.getElementById("t-cal-layout").classList.toggle("timed", timed);
  document.getElementById("t-cal-times").classList.toggle("hidden", !timed);
  document.getElementById("t-week-grid").classList.toggle("hidden", mode !== "week");
  document.getElementById("t-day-grid").classList.toggle("hidden", mode !== "day");
  document.getElementById("t-cal-month").classList.toggle("hidden", mode !== "month");
  document.getElementById("t-year-wrap").classList.toggle("hidden", mode !== "year");
  if (mode === "week") drawTalentTimeGrid("t-week-grid", 7, startOfWeekMon(cur));
  if (mode === "day") drawTalentTimeGrid("t-day-grid", 1, new Date(cur.getFullYear(), cur.getMonth(), cur.getDate()));
  if (mode === "month") drawTalentMonth(document.getElementById("t-cal-month"), cur.getFullYear(), cur.getMonth(), true);
  if (mode === "year") {
    const y = document.getElementById("t-year-wrap");
    y.innerHTML = "";
    for (let m = 0; m < 12; m++) {
      const card = document.createElement("div");
      drawTalentMonth(card, cur.getFullYear(), m, false);
      y.appendChild(card);
    }
  }
}

function drawTalentTimeGrid(id, cols, startDay) {
  const hours = [];
  for (let h = 5; h <= 21; h++) hours.push(h);
  document.getElementById("t-cal-times").innerHTML = `<div class="time-pad"></div>` + hours.map((h) => `<div class="hour">${hourLabel(h)}</div>`).join("");
  const el = document.getElementById(id);
  el.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  el.innerHTML = hours.map((h) => {
    let cells = "";
    for (let c = 0; c < cols; c++) {
      const day = new Date(startDay); day.setDate(startDay.getDate() + c);
      cells += `<div class="cell" data-h="${h}" data-d="${day.toDateString()}"></div>`;
    }
    return cells;
  }).join("");
  if (cols === 1 && startDay.toDateString() === NOW.toDateString()) {
    const h = NOW.getHours() + NOW.getMinutes() / 60;
    const idx = Math.floor(h) - 5;
    const cell = el.querySelectorAll(".cell")[idx];
    if (cell) {
      const line = document.createElement("div");
      line.className = "now-line";
      line.style.top = `${((h % 1) * 56)}px`;
      cell.appendChild(line);
    }
  }
  reservedEvents().forEach((ev) => {
    const st = new Date(ev.startAt);
    const en = new Date(ev.endAt);
    for (let c = 0; c < cols; c++) {
      const day = new Date(startDay); day.setDate(startDay.getDate() + c);
      if (st.toDateString() !== day.toDateString()) continue;
      if (st.getHours() < 5) continue;
      const cells = [...el.querySelectorAll(`.cell[data-d="${day.toDateString()}"]`)];
      const cell = cells[st.getHours() - 5];
      if (!cell) continue;
      const block = document.createElement("div");
      block.className = `block ${talentStatusOf(ev)}`;
      block.style.top = `${(st.getMinutes() / 60) * 56}px`;
      block.style.height = `${Math.max(24, ((en - st) / 3600000) * 56)}px`;
      block.textContent = ev.name;
      block.onclick = () => go(`#/talent/event/${ev.id}`);
      cell.appendChild(block);
    }
  });
}

function drawTalentMonth(container, year, month, large) {
  container.className = large ? "month-card month-grid t-month" : "month-card";
  if (year === NOW.getFullYear() && month === NOW.getMonth()) container.classList.add("current");
  const first = new Date(year, month, 1);
  const start = (first.getDay() + 6) % 7;
  const daysIn = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const dow = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const dowShort = ["M", "T", "W", "T", "F", "S", "S"];
  const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let cells = "";
  for (let i = 0; i < start; i++) {
    const d = prevDays - start + 1 + i;
    cells += `<span class="muted-day">${d}</span>`;
  }
  for (let d = 1; d <= daysIn; d++) {
    const isToday = year === NOW.getFullYear() && month === NOW.getMonth() && d === NOW.getDate();
    const onDay = reservedEvents().filter((ev) => {
      const s = new Date(ev.startAt);
      const e = new Date(ev.endAt);
      const startD = new Date(s.getFullYear(), s.getMonth(), s.getDate());
      const endD = new Date(e.getFullYear(), e.getMonth(), e.getDate());
      const curD = new Date(year, month, d);
      return curD >= startD && curD <= endD;
    });
    const chips = large ? onDay.slice(0, 2).map((ev) => {
      const st = fmtDetailTime(ev.startAt);
      const en = fmtDetailTime(ev.endAt);
      return `<button class="t-chip ${talentStatusOf(ev)}" type="button" data-te="${ev.id}"><b>${escapeHtml(ev.name)}</b><small>${st} – ${en}</small></button>`;
    }).join("") : "";
    const more = large && onDay.length > 2 ? `<span class="t-more">+${onDay.length - 2} more</span>` : "";
    const label = d === 1 ? `${mon[month]} ${d}` : String(d);
    cells += `<span class="t-day">${`<span class="day-num ${isToday ? "today" : ""}">${label}</span>`}${chips}${more}</span>`;
  }
  const head = large
    ? `<div class="dow t-dow">${dow.map((x) => `<span>${x}</span>`).join("")}</div>`
    : `<h3>${MONTHS[month]}</h3><div class="dow">${dowShort.map((x) => `<span>${x}</span>`).join("")}</div>`;
  container.innerHTML = `${head}<div class="days">${cells}</div>`;
}

function reserve(ev, wait) {
  if (ev.approval) {
    db.registrations.push({ id: "r" + Date.now(), eventId: ev.id, personId: db.talentId, status: "Pending", source: "link", ticket: "", paid: ev.ticket !== "paid", joined: false });
    save(); toast("Your request was sent. You’ll hear when the host decides."); render(); return;
  }
  if (wait) {
    db.registrations.push({ id: "r" + Date.now(), eventId: ev.id, personId: db.talentId, status: "Waitlisted", source: "link", ticket: "", paid: true, joined: false });
    save(); toast("This event is full. Join the waitlist."); render(); return;
  }
  const cap = Number(ev.capacity);
  if (cap && goingCount(ev) >= cap) {
    toast("This event just filled."); return;
  }
  const existing = myReg(ev.id);
  if (existing) {
    existing.status = ev.ticket === "paid" ? "Unpaid" : "Going";
    existing.ticket = existing.ticket || ticketCode();
  } else {
    db.registrations.push({
      id: "r" + Date.now(), eventId: ev.id, personId: db.talentId,
      status: ev.ticket === "paid" ? "Unpaid" : "Going", source: "link",
      ticket: ticketCode(), paid: ev.ticket !== "paid", joined: false
    });
  }
  save();
  toast(ev.ticket === "paid" ? "Pay to complete Going." : "Reserved. This is on your Enum calendar.");
  render();
}

function cancelMine(ev, r) {
  if (statusOf(ev) === "Ended") { toast("This event has ended, so the reservation can’t be cancelled."); return; }
  if (r.status === "Cancelled") return;
  const run = () => {
    r.status = "Cancelled";
    save();
    toast("Your reservation has been cancelled.");
    const next = db.registrations.find((x) => x.eventId === ev.id && x.status === "Waitlisted");
    if (next && ev.waitlist) {
      next.status = "Going";
      next.ticket = next.ticket || ticketCode();
      toast("Waitlist promoted — the next person is Going.");
    }
    render();
  };
  if (r.status === "Checked in") ask("You’re marked as arrived. Cancel anyway?", run, "Cancel reservation");
  else ask("Cancel this reservation? It will leave your Upcoming calendar.", run, "Cancel reservation");
}

function downloadIcs(ev, r) {
  if (!r || !["Going", "Checked in"].includes(r.status)) {
    toast("This reservation is no longer active."); return;
  }
  const join = (ev.enumHostsMeeting && ev.roomOpen) ? "Enum Meet" : (ev.meetingUrl || ev.place || "");
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:${r.id}@enumverse\nDTSTART;TZID=Africa/Lagos:${ev.startAt.replace(/[-:]/g, "")}00\nDTEND;TZID=Africa/Lagos:${ev.endAt.replace(/[-:]/g, "")}00\nSUMMARY:${ev.name}\nLOCATION:${join}\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: "text/calendar" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${ev.id}.ics`;
  a.click();
  toast("Calendar file downloaded. Success copy never claims Google unless you use that button.");
}

function showTicket(ev, r) {
