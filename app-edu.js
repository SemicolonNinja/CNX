const STORAGE = "enumverse-prd-proto-v2";
const NOW = new Date("2026-09-15T07:10:00");
const TZ = "GMT+1";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
const DOW = ["S","M","T","W","T","F","S"];

const PEOPLE = [
  { id: "p-james", name: "James Bond", email: "james@jamesbond.inc", initials: "JB", sms: true },
  { id: "p-ada", name: "Ada Okonkwo", email: "ada@enumverse.com", initials: "AO", sms: true },
  { id: "p-chi", name: "Chioma Eze", email: "chioma@enumverse.com", initials: "CE", sms: false },
  { id: "p-sam", name: "Samuel Ade", email: "samuel@enumverse.com", initials: "SA", sms: true },
  { id: "p-elom", name: "Elom K.", email: "elom@enumverse.com", initials: "EK", sms: false }
];

function seed() {
  const events = [
    {
      id: "e-huddle", name: "Morning huddle", description: "Daily LTX standup on Enum Meet.",
      visibility: "Private", category: "Business", locationMode: "Virtual", place: "",
      meetingUrl: "", startAt: "2026-09-15T07:00", endAt: "2026-09-15T08:00",
      guests: [], reminders: "15 minutes before", enumHostsMeeting: true, image: "",
      capacity: 12, privacy: "hidden", approval: false, waitlist: true, ticket: "free", price: 0,
      sms: "24h and 1h (opted-in only)", roomOpen: false, earlyEntry: true, waitingRoom: true, lifecycle: "Scheduled",
      views: 40, series: "LTX daily", host: "Jamesbond Inc.", hostInitial: "J", discoverable: false,
      regWindow: "open", questions: []
    },
    {
      id: "e-lab", name: "Enum Facilitation Lab", description: "Public masterclass. Free reserve, paywall off.",
      visibility: "Public", category: "Education", locationMode: "Virtual", place: "",
      meetingUrl: "", startAt: "2026-09-18T10:00", endAt: "2026-09-18T12:00",
      guests: [], reminders: "1 day before", enumHostsMeeting: true, image: "",
      capacity: 25, privacy: "count", approval: false, waitlist: true, ticket: "free", price: 0,
      sms: "24h and 1h (opted-in only)", roomOpen: false, earlyEntry: false, lifecycle: "Scheduled",
      views: 180, series: "", regWindow: "open", waitingRoom: false,
      questions: [
        { id: "q1", type: "short", label: "What do you want to practise?", required: true },
        { id: "q2", type: "single", label: "How did you hear about this?", required: false, options: "Colleague, Discover, Invite" },
        { id: "q3", type: "ack", label: "I agree to be on the recording if the host records.", required: true }
      ],
      host: "Jamesbond Inc.", hostInitial: "J", discoverable: true
    },
    {
      id: "e-paid", name: "Paid cohort clinic", description: "Paywall checked again at Join.",
      visibility: "Public", category: "Education", locationMode: "Virtual", place: "",
      meetingUrl: "", startAt: "2026-09-22T14:00", endAt: "2026-09-22T16:00",
      guests: [], reminders: "1 hour before", enumHostsMeeting: true, image: "",
      capacity: 8, privacy: "hidden", approval: false, waitlist: true, ticket: "paid", price: 5000,
      sms: "Off — email and in-app only", roomOpen: false, earlyEntry: false, waitingRoom: true, lifecycle: "Scheduled",
      views: 64, series: "", regWindow: "open", questions: [], host: "Jamesbond Inc.", hostInitial: "J", discoverable: true
    },
    {
      id: "e-standup", name: "LTX Weekly standup", description: "Invite / CSV cohort session.",
      visibility: "Private", category: "Business", locationMode: "Virtual", place: "",
      meetingUrl: "", startAt: "2026-09-16T09:00", endAt: "2026-09-16T09:30",
      guests: ["james@jamesbond.inc"], reminders: "1 hour before", enumHostsMeeting: true, image: "",
      capacity: 15, privacy: "hidden", approval: true, waitlist: false, ticket: "free", price: 0,
      sms: "24h and 1h (opted-in only)", roomOpen: false, earlyEntry: false, waitingRoom: false, lifecycle: "Scheduled",
      views: 22, series: "LTX weekly", host: "Jamesbond Inc.", hostInitial: "J", discoverable: false, regWindow: "open", questions: []
    },
    {
      id: "e-culture", name: "Team Culture Fit", description: "",
      visibility: "Private", category: "Education", locationMode: "Virtual", place: "",
      meetingUrl: "", startAt: "2026-09-20T15:30", endAt: "2026-09-20T17:00",
      guests: ["james@jamesbond.inc", "host@enumverse.com", "ops@enumverse.com"],
      reminders: "1 day before", enumHostsMeeting: true, image: "",
      capacity: "", privacy: "hidden", approval: false, waitlist: false, ticket: "free", price: 0,
      sms: "Off — email and in-app only", roomOpen: true, earlyEntry: false, lifecycle: "Scheduled",
      views: 11, series: "", host: "Jamesbond Inc.", hostInitial: "J",
      discoverable: false, copyDisabled: false, regWindow: "open", waitingRoom: false, questions: []
    },
    {
      id: "e-aylive", name: "Ay Live", description: "",
      visibility: "Public", category: "Entertainment", locationMode: "Virtual", place: "",
      meetingUrl: "", startAt: "2026-09-16T17:00", endAt: "2026-09-22T18:00",
      guests: [], reminders: "None", enumHostsMeeting: true, image: "",
      capacity: "", privacy: "hidden", approval: false, waitlist: false, ticket: "free", price: 0,
      sms: "Off — email and in-app only", roomOpen: true, earlyEntry: true, lifecycle: "Scheduled",
      views: 48, series: "", host: "Worknprogress", hostInitial: "W",
      discoverable: true, copyDisabled: false, publishedOn: "2026-09-02",
      privacy: "count", regWindow: "open", waitingRoom: false, questions: []
    },
    {
      id: "e-testnl", name: "Test not logged in", description: "",
      visibility: "Public", category: "Business", locationMode: "Hybrid", place: "Lagos",
      meetingUrl: "", startAt: "2027-08-10T11:45", endAt: "2027-08-10T12:45",
      guests: [], reminders: "None", enumHostsMeeting: true, image: "",
      capacity: "", privacy: "hidden", approval: false, waitlist: false, ticket: "free", price: 0,
      sms: "Off — email and in-app only", roomOpen: false, earlyEntry: false, lifecycle: "Scheduled",
      views: 6, series: "", host: "Worknprogress", hostInitial: "W",
      discoverable: true, copyDisabled: false, cover: "ui",
      regWindow: "opens", opensAt: "2026-10-01T09:00", questions: []
    },
    {
      id: "e-book", name: "Book reader",
      description: "Rtu is the one who wants it",
      visibility: "Public", category: "Business", locationMode: "Physical",
      place: "Yaba, Lagos, Nigeria", meetingUrl: "",
      startAt: "2026-09-07T18:00", endAt: "2026-09-07T18:15",
      guests: [], reminders: "None", enumHostsMeeting: false, image: "",
      capacity: "", privacy: "hidden", approval: false, waitlist: false, ticket: "free", price: 0,
      sms: "Off — email and in-app only", roomOpen: false, earlyEntry: false, lifecycle: "Scheduled",
      views: 20, series: "", host: "Jamesbond Inc.", hostInitial: "J",
      discoverable: false, copyDisabled: true, cover: "quote-book",
      privacy: "visible", regWindow: "closed", questions: [],
      tags: ["Geh", "HSwjo"],
      coverQuote: "If we want to live and love with our whole heart, and if we want to engage with the world from a place of worthiness, we have to talk about the things that get in the way — especially shame, fear, and our struggle to be vulnerable.",
      coverCite: "The Gifts of Imperfection: Let Go of Who You Think… by Brené Brown"
    },
    {
      id: "e-retro", name: "Cohort retro", description: "Ended hybrid session with recording.",
      visibility: "Private", category: "Education", locationMode: "Hybrid", place: "Yaba, Lagos",
      meetingUrl: "", startAt: "2026-09-14T14:00", endAt: "2026-09-14T15:30",
      guests: [], reminders: "None", enumHostsMeeting: true, image: "",
      capacity: 20, privacy: "hidden", approval: false, waitlist: false, ticket: "free", price: 0,
      sms: "Off — email and in-app only", roomOpen: false, earlyEntry: false, lifecycle: "Scheduled",
      views: 90, series: "LTX weekly", hadBreakouts: true, groupingDismissed: false,
      host: "Jamesbond Inc.", hostInitial: "J", discoverable: false, regWindow: "closed", waitingRoom: false, questions: []
    }
  ];
  const registrations = [
    { id: "r1", eventId: "e-huddle", personId: "p-james", status: "Going", source: "invite", ticket: "TKT-HUD-JB", paid: true, joined: false },
    { id: "r2", eventId: "e-huddle", personId: "p-ada", status: "Going", source: "invite", ticket: "TKT-HUD-AO", paid: true, joined: false },
    { id: "r3", eventId: "e-lab", personId: "p-ada", status: "Going", source: "link", ticket: "TKT-LAB-AO", paid: true, joined: false },
    { id: "r4", eventId: "e-lab", personId: "p-chi", status: "Going", source: "link", ticket: "TKT-LAB-CE", paid: true, joined: false, smsFailed: true, delivery: "SMS to Chioma Eze failed. Email was sent." },
    { id: "r5", eventId: "e-paid", personId: "p-sam", status: "Going", source: "link", ticket: "TKT-PAY-SA", paid: true, joined: false },
    { id: "r6", eventId: "e-paid", personId: "p-james", status: "Unpaid", source: "link", ticket: "TKT-PAY-JB", paid: false, joined: false },
    { id: "r7", eventId: "e-standup", personId: "p-james", status: "Going", source: "invite", ticket: "TKT-STU-JB", paid: true, joined: false },
    { id: "r8", eventId: "e-standup", personId: "p-elom", status: "Pending", source: "link", ticket: "TKT-STU-EK", paid: true, joined: false },
    { id: "r9", eventId: "e-culture", personId: "p-james", status: "Going", source: "invite", ticket: "TKT-CUL-JB", paid: true, joined: false },
    { id: "r10", eventId: "e-culture", personId: "p-ada", status: "Invited", source: "invite", ticket: "", paid: true, joined: false },
    { id: "r11", eventId: "e-retro", personId: "p-james", status: "Checked in", source: "invite", ticket: "TKT-RET-JB", paid: true, joined: true, checkedInAt: "2026-09-14T14:05" },
    { id: "r12", eventId: "e-retro", personId: "p-ada", status: "Checked in", source: "invite", ticket: "TKT-RET-AO", paid: true, joined: true, checkedInAt: "2026-09-14T14:06" },
    { id: "r13", eventId: "e-retro", personId: "p-chi", status: "Going", source: "invite", ticket: "TKT-RET-CE", paid: true, joined: false },
    { id: "r14", eventId: "e-lab", personId: "p-elom", status: "Waitlisted", source: "link", ticket: "", paid: true, joined: false },
    { id: "r15", eventId: "e-book", personId: "p-james", status: "Checked in", source: "link", ticket: "TKT-BOK-JB", paid: true, joined: true, checkedInAt: "2026-09-07T18:02" },
    { id: "r16", eventId: "e-book", personId: "p-sam", status: "No-show", source: "link", ticket: "TKT-BOK-SA", paid: true, joined: false },
    { id: "r17", eventId: "e-aylive", personId: "p-ada", status: "Going", source: "link", ticket: "TKT-AYL-AO", paid: true, joined: false, hideOnGuestList: true }
  ];
  return {
    events,
    registrations,
    talentId: "p-james",
    meet: { eventId: null, locked: false, recording: false, chats: [], breakoutsOpen: false },
    summary: {
      "e-retro": {
        status: "draft",
        summary: "The cohort reviewed last sprint’s facilitation labs and agreed to keep Sunday-start weeks on the Calendar.",
        key_details: ["Attendance was strong in the main room.", "Breakout A discussed door rules; Breakout B discussed Join windows."],
        decisions: ["Publish notes only after host review."],
        action_items: [
          { task: "Wire cancel reservation on talent event page", owner_user_id: "p-james", due: "2026-09-18", confidence: "high", quote: "Cancel has to live next to You’re going." },
          { task: "Draft SMS copy for Chioma", owner_user_id: "p-chi", due: "2026-09-19", confidence: "low", quote: "" }
        ]
      }
    },
    groups: [],
    roles: [
      { personId: "p-ada", role: "owner" },
      { personId: "p-james", role: "check-in staff" }
    ],
    calendarUrl: "webcal://cal.enumverse.com/hosts/james-inc.ics",
    notify: { inApp: true, email: true, sms: false },
    importPreview: null
  };
}

let db = load();
let ui = {
  tab: "Upcoming",
  view: "list",
  calMode: "week",
  calCursor: new Date("2026-09-15"),
  search: "",
  typeFilter: "",
  locFilter: "",
  dateFilter: "",
  page: 1,
  pageSize: 10,
  editingId: null,
  route: { app: "edu", page: "home", id: null, extra: null },
  dtab: "overview",
  pFilter: "All",
  ttab: "Discover",
  tSearch: "",
  tLoc: "",
  tDate: "",
  tCalMode: "month",
  tCalCursor: new Date("2026-09-15"),
  tCalView: "calendar",
  tCalTab: "Upcoming",
  tCalSearch: "",
  tCalLoc: "",
  tCalDate: "",
  pendingReserve: null,
  confirm: null,
  importRows: [],
  cameraDenied: false,
  checkinOffline: false,
  draftQuestions: []
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (raw) {
      const data = JSON.parse(raw);
      data.notify = data.notify || { inApp: true, email: true, sms: false };
      data.meet = data.meet || { eventId: null, locked: false, recording: false, chats: [], breakoutsOpen: false };
      return data;
    }
  } catch (_) {}
  return seed();
}
function save() { localStorage.setItem(STORAGE, JSON.stringify(db)); }

function person(id) { return PEOPLE.find((p) => p.id === id); }
function eventBy(id) { return db.events.find((e) => e.id === id); }
function regsFor(eventId) { return db.registrations.filter((r) => r.eventId === eventId); }
function myReg(eventId) { return db.registrations.find((r) => r.eventId === eventId && r.personId === db.talentId); }
function goingCount(ev) {
  return regsFor(ev.id).filter((r) => ["Going", "Checked in"].includes(r.status)).length;
}

function statusOf(ev) {
  if (ev.lifecycle === "Cancelled") return "Cancelled";
  if (ev.lifecycle === "Deleted") return "Cancelled";
  const s = new Date(ev.startAt);
  const e = new Date(ev.endAt);
  if (e < NOW) return "Ended";
  if (s <= NOW && e >= NOW) return "Ongoing";
  return "Upcoming";
}

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function fmtDate(iso) {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return {
    date: `${day}, ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`,
    time: `${String(h).padStart(2, "0")}:${m} ${ap} ${TZ}`
  };
}
function fmtWhen(iso) {
  const f = fmtDate(iso);
  return `${f.date} · ${f.time}`;
}

function startOfWeek(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - x.getDay());
  return x;
}

function inDatePreset(ev, preset) {
  if (!preset) return true;
  const s = new Date(ev.startAt);
  const startOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = startOf(NOW);
  const yest = new Date(today); yest.setDate(today.getDate() - 1);
  const day = startOf(s).getTime();
  if (preset === "Today") return day === today.getTime();
  if (preset === "Yesterday") return day === yest.getTime();
  const weekStart = startOfWeek(today);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 7);
  if (preset === "This week") return s >= weekStart && s < weekEnd;
  const lastWeekStart = new Date(weekStart); lastWeekStart.setDate(weekStart.getDate() - 7);
  if (preset === "Last week") return s >= lastWeekStart && s < weekStart;
  if (preset === "This month") return s.getMonth() === NOW.getMonth() && s.getFullYear() === NOW.getFullYear();
  if (preset === "Last month") {
    const m = NOW.getMonth() === 0 ? 11 : NOW.getMonth() - 1;
    const y = NOW.getMonth() === 0 ? NOW.getFullYear() - 1 : NOW.getFullYear();
    return s.getMonth() === m && s.getFullYear() === y;
  }
  return true;
}

function toast(msg) {
  const t = document.getElementById("support-toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(t._hide);
  t._hide = setTimeout(() => t.classList.add("hidden"), 2800);
}

function ticketCode() {
  return "TKT-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function joinInfo(ev, reg) {
  if (ev.lifecycle === "Cancelled") return { kind: "ended", cta: "", msg: "This event has been cancelled." };
  if (!reg || !["Going", "Checked in"].includes(reg.status)) {
    if (reg?.status === "Cancelled") return { kind: "blocked", msg: "This reservation was cancelled." };
    if (reg?.status === "Pending") return { kind: "blocked", msg: "Your request was sent. You’ll hear when the host decides." };
    if (reg?.status === "Waitlisted") return { kind: "blocked", msg: "This event is full. Join the waitlist." };
    if (reg?.status === "Unpaid") return { kind: "blocked", msg: "Payment is incomplete, so you can’t join yet." };
    if (reg?.status === "Invited") return { kind: "blocked", msg: "Sign in to accept this invitation." };
    return { kind: "blocked", msg: "Reserve a spot to join." };
  }
  const st = new Date(ev.startAt);
  const en = new Date(ev.endAt);
  if (statusOf(ev) === "Ended" || NOW > en) return { kind: "ended", msg: "This event has ended." };
  if (NOW < st && !ev.earlyEntry) return { kind: "early", msg: `This session opens at ${fmtWhen(ev.startAt)}.` };
  if (!ev.roomOpen) return { kind: "host", msg: "The host hasn’t opened the room yet." };
  return { kind: "live", msg: "Join event.", cta: "Join event" };
}

function doorState(ev) {
  if (ev.lifecycle === "Cancelled") return { kind: "cancelled", msg: "This event has been cancelled." };
  if (statusOf(ev) === "Ended") return { kind: "ended", msg: "This event has ended, so the reservation can’t be cancelled." };
  if (ev.regWindow === "closed") return { kind: "closed", msg: "Registration is closed." };
  if (ev.regWindow === "opens" && ev.opensAt && new Date(ev.opensAt) > NOW) {
    return { kind: "opens", msg: `Registration opens on ${fmtWhen(ev.opensAt)}.` };
  }
  const cap = Number(ev.capacity);
  if (cap && goingCount(ev) >= cap) {
    return ev.waitlist
      ? { kind: "full-wait", msg: "This event is full. Join the waitlist." }
      : { kind: "full", msg: "This event is full." };
  }
  return { kind: "open", msg: "" };
}

function csvSafe(v) {
  const s = String(v ?? "");
  const escaped = /^[=+\-@]/.test(s) ? `'${s}` : s;
  if (/[",\n]/.test(escaped)) return `"${escaped.replace(/"/g, '""')}"`;
  return escaped;
}

function applyNoShows(ev) {
  if (statusOf(ev) !== "Ended") return;
  regsFor(ev.id).forEach((r) => {
    if (r.status === "Going" && !r.joined && !r.checkedInAt) r.status = "No-show";
  });
}

function publicGuests(ev) {
  return regsFor(ev.id).filter((r) => ["Going", "Checked in"].includes(r.status) && !r.hideOnGuestList);
}

function defaultQuestions() {
  return [];
}

function questionFieldHtml(q) {
  const req = q.required ? " *" : "";
  const label = `<label>${escapeHtml(q.label)}${req}</label>`;
  if (q.type === "long") return `${label}<textarea data-qid="${q.id}"></textarea>`;
  if (q.type === "single") {
    const opts = (q.options || "Yes, No").split(",").map((o) => o.trim()).filter(Boolean);
    return `${label}<select data-qid="${q.id}"><option value=""></option>${opts.map((o) => `<option>${escapeHtml(o)}</option>`).join("")}</select>`;
  }
  if (q.type === "multi") {
    const opts = (q.options || "A, B").split(",").map((o) => o.trim()).filter(Boolean);
    return `${label}<div>${opts.map((o) => `<label class="switch">${escapeHtml(o)}<input type="checkbox" data-qid="${q.id}" data-opt="${escapeHtml(o)}" /><span class="slider"></span></label>`).join("")}</div>`;
  }
  if (q.type === "ack") return `<label class="switch">${escapeHtml(q.label)}${req}<input type="checkbox" data-qid="${q.id}" /><span class="slider"></span></label>`;
  return `${label}<input data-qid="${q.id}" />`;
}

function questionAnswered(q) {
  if (q.type === "ack") return !!document.querySelector(`[data-qid="${q.id}"]`)?.checked;
  if (q.type === "multi") return [...document.querySelectorAll(`[data-qid="${q.id}"]`)].some((el) => el.checked);
  return !!document.querySelector(`[data-qid="${q.id}"]`)?.value?.trim();
}

function startOfWeekMon(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  return x;
}

function talentStatusOf(ev) {
  return statusOf(ev);
}

function isReserved(ev) {
  const r = myReg(ev.id);
  return r && ["Going", "Checked in"].includes(r.status);
}

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function fmtCardWhen(ev) {
  const s = new Date(ev.startAt);
  const e = new Date(ev.endAt);
  const sameDay = s.toDateString() === e.toDateString();
  const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const startBit = `${s.toLocaleString("en-US", { weekday: "short" })}, ${mon[s.getMonth()]} ${ordinal(s.getDate())} ${s.getFullYear()}`;
  if (!sameDay) {
    const endBit = `${e.toLocaleString("en-US", { weekday: "short" })}, ${mon[e.getMonth()]} ${ordinal(e.getDate())} ${e.getFullYear()}`;
    return `${startBit} – ${endBit}`;
  }
  const f = fmtDate(ev.startAt);
  return `${startBit} · ${f.time.replace(" " + TZ, "")}`;
}

function fmtDetailDay(iso) {
  const d = new Date(iso);
  const wd = d.toLocaleString("en-US", { weekday: "short" });
  return `${wd}, ${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function fmtDetailTime(iso) {
  const d = new Date(iso);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ap = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${m} ${ap} WAT`;
}

function closeMenus() {
  document.querySelectorAll(".menu, .submenu, .ji-menu").forEach((el) => el.classList.add("hidden"));
}

/* ---------- routing ---------- */
function parseRoute() {
  const h = (location.hash || "#/edu").replace(/^#/, "");
  const parts = h.split("/").filter(Boolean);
  const app = parts[0] || "edu";
  if (app === "meet") return { app: "meet", page: "room", id: parts[1], extra: null };
  if (app === "community") return { app: "community", page: "home", id: null, extra: null };
  if (app === "talent") {
    if (parts[1] === "event") return { app: "talent", page: "event", id: parts[2] || null, extra: null };
    if (parts[1] === "events") {
      const tab = parts[2];
      return { app: "talent", page: "list", id: null, extra: tab || "discover" };
    }
    if (parts[1] === "settings") return { app: "talent", page: "settings", id: null, extra: null };
    if (parts[1] === "going") return { app: "talent", page: "list", id: null, extra: "going" };
    if (parts[1] === "past") return { app: "talent", page: "list", id: null, extra: "past" };
    if (parts[1] === "calendar") {
      if (parts[2] === "events") return { app: "talent", page: "calendar", id: null, extra: "grid" };
      return { app: "talent", page: "calendar", id: parts[2] || null, extra: parts[2] ? "event" : null };
    }
    return { app: "talent", page: "dash", id: null, extra: null };
  }
  if (parts[1] === "event") return { app: "edu", page: parts[3] || "detail", id: parts[2], extra: parts[3] || null };
  return { app: "edu", page: "home", id: null, extra: null };
}
function go(hash) { location.hash = hash; }

function showShell() {
  const r = ui.route = parseRoute();
  document.getElementById("edu-shell").classList.toggle("hidden", r.app !== "edu");
  document.getElementById("talent-shell").classList.toggle("hidden", r.app !== "talent");
  document.getElementById("meet-shell").classList.toggle("hidden", r.app !== "meet");
  document.getElementById("community-shell").classList.toggle("hidden", r.app !== "community");
  const demo = r.app === "meet" || r.app === "community" ? "edu" : r.app;
  document.querySelectorAll(".demo-app").forEach((b) => b.classList.toggle("on", b.dataset.app === demo));
  document.querySelectorAll("#edu-shell > main").forEach((m) => m.classList.add("hidden"));
  if (r.app === "edu") {
    const id = {
      home: "view-edu-home",
      detail: "view-edu-detail",
      checkin: "view-edu-checkin",
      summary: "view-edu-summary",
      grouping: "view-edu-grouping",
      insights: "view-edu-insights"
    }[r.page] || "view-edu-home";
    document.getElementById(id).classList.remove("hidden");
  }
  if (r.app === "talent") {
    document.getElementById("view-talent-dash").classList.toggle("hidden", r.page !== "dash");
    document.getElementById("view-talent-list").classList.toggle("hidden", r.page !== "list");
    document.getElementById("view-talent-event").classList.toggle("hidden", r.page !== "event");
    document.getElementById("view-talent-calendar").classList.toggle("hidden", r.page !== "calendar");
    document.getElementById("view-talent-settings").classList.toggle("hidden", r.page !== "settings");
    const nav = r.page === "event"
      ? (isReserved(eventBy(r.id) || {}) ? "calendar" : "events")
      : (r.page === "list" ? "events" : r.page === "calendar" ? "calendar" : r.page === "settings" ? "settings" : "dash");
    document.querySelectorAll("#talent-nav [data-tnav]").forEach((b) => {
      b.classList.toggle("active", b.dataset.tnav === nav);
    });
  }
}

function render() {
  showShell();
  const r = ui.route;
  if (r.app === "edu" && r.page === "home") renderHome();
  if (r.app === "edu" && r.page === "detail") renderDetail();
  if (r.app === "edu" && r.page === "checkin") renderCheckin();
  if (r.app === "edu" && r.page === "summary") renderSummary();
  if (r.app === "edu" && r.page === "grouping") renderGrouping();
  if (r.app === "edu" && r.page === "insights") renderInsights();
  if (r.app === "talent" && r.page === "dash") renderTalentDash();
  if (r.app === "talent" && r.page === "list") renderTalentList();
  if (r.app === "talent" && r.page === "event") renderTalentEvent();
  if (r.app === "talent" && r.page === "calendar") renderTalentCalendar();
  if (r.app === "talent" && r.page === "settings") renderTalentSettings();
  if (r.app === "meet") renderMeet();
  if (r.app === "community") renderCommunity();
}

function counts() {
  const c = { Upcoming: 0, Ongoing: 0, Ended: 0, Cancelled: 0 };
  db.events.filter((e) => e.lifecycle !== "Deleted" && !e.archived).forEach((e) => { c[statusOf(e)] += 1; });
  const invited = db.registrations.filter((r) => r.status === "Invited").length;
  const registered = db.registrations.filter((r) => ["Going", "Checked in"].includes(r.status)).length;
  return { ...c, total: db.events.filter((e) => e.lifecycle !== "Deleted" && !e.archived).length, invited, registered };
}

function filteredEvents() {
  return db.events.filter((e) => {
    if (e.lifecycle === "Deleted" || e.archived) return false;
    if (statusOf(e) !== ui.tab) return false;
    if (ui.typeFilter && e.visibility !== ui.typeFilter) return false;
    if (ui.locFilter && e.locationMode !== ui.locFilter) return false;
    if (!inDatePreset(e, ui.dateFilter)) return false;
    const q = ui.search.trim().toLowerCase();
    if (q && !(`${e.name} ${e.description || ""}`.toLowerCase().includes(q))) return false;
    return true;
  }).sort((a, b) => new Date(b.startAt) - new Date(a.startAt));
}

function renderHome() {
  const c = counts();
  document.getElementById("stat-total").textContent = c.total;
  document.getElementById("stat-up").textContent = c.Upcoming;
  document.getElementById("stat-on").textContent = c.Ongoing;
  document.getElementById("stat-en").textContent = c.Ended;
  document.getElementById("stat-ca").textContent = c.Cancelled;
  document.getElementById("stat-people").textContent = c.invited + c.registered;
  document.getElementById("stat-inv").textContent = c.invited;
  document.getElementById("stat-reg").textContent = c.registered;
  document.querySelectorAll("#view-edu-home .tab[data-tab]").forEach((t) => {
    t.classList.toggle("active", t.dataset.tab === ui.tab);
    t.querySelector(".count").textContent = c[t.dataset.tab];
  });
  const isList = ui.view === "list";
  document.getElementById("list-view").classList.toggle("hidden", !isList);
  document.getElementById("cal-view").classList.toggle("hidden", isList);
  document.getElementById("list-toolbar").classList.toggle("hidden", !isList);
  document.getElementById("btn-list").classList.toggle("active", isList);
  document.getElementById("btn-cal").classList.toggle("active", !isList);
  document.getElementById("btn-list-2").classList.toggle("active", isList);
  document.getElementById("btn-cal-2").classList.toggle("active", !isList);
  if (isList) renderTable();
  else renderCalendar();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
}
function globe() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg>`;
}
function lock() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>`;
}

function renderTable() {
  const rows = filteredEvents();
  const pages = Math.max(1, Math.ceil(rows.length / ui.pageSize));
  if (ui.page > pages) ui.page = pages;
  const start = (ui.page - 1) * ui.pageSize;
  const slice = rows.slice(start, start + ui.pageSize);
  document.getElementById("tbody").innerHTML = slice.map((e) => {
    const s = fmtDate(e.startAt);
    const en = fmtDate(e.endAt);
    const av = e.image ? `<div class="av"><img src="${e.image}" alt=""></div>` : `<div class="av">${initials(e.name)}</div>`;
    const pill = e.visibility === "Public" ? `<span class="pill public">${globe()} Public</span>` : `<span class="pill private">${lock()} Private</span>`;
    return `<tr>
      <td><div class="ev">${av}<div><button class="name-btn" data-open="${e.id}" type="button"><strong>${escapeHtml(e.name)}</strong></button>${e.description ? `<small>${escapeHtml(e.description)}</small>` : ""}</div></div></td>
      <td>${pill}</td><td>${e.locationMode}</td>
      <td class="dt">${s.date}<span>${s.time}</span></td>
      <td class="dt">${en.date}<span>${en.time}</span></td>
      <td><button class="kebab" data-edit="${e.id}" type="button">⋮</button></td>
    </tr>`;
  }).join("");
  document.getElementById("page-label").textContent = `Page ${ui.page} of ${pages}`;
  document.getElementById("page-chip").textContent = ui.page;
  document.getElementById("prev").disabled = ui.page <= 1;
  document.getElementById("next").disabled = ui.page >= pages;
}

function hourLabel(h) {
  if (h === 12) return "12 PM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}
function weekRangeLabel(start) {
  const end = new Date(start); end.setDate(start.getDate() + 6);
  const a = start.toLocaleString("en-US", { month: "short", day: "numeric" });
  if (start.getMonth() === end.getMonth()) return `${a} – ${end.getDate()}, ${end.getFullYear()}`;
  return `${a} – ${end.toLocaleString("en-US", { month: "short", day: "numeric" })}, ${end.getFullYear()}`;
}

function renderCalendar() {
  const mode = ui.calMode;
  document.getElementById("cal-mode").value = mode;
  const cur = ui.calCursor;
  let label = "";
  if (mode === "day") label = cur.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
  if (mode === "week") label = weekRangeLabel(startOfWeek(cur));
  if (mode === "month") label = cur.toLocaleString("en-US", { month: "long", year: "numeric" });
  if (mode === "year") label = String(cur.getFullYear());
  document.getElementById("range-label").textContent = label;
  document.getElementById("today-btn").classList.toggle("hidden", mode === "week");
  const timed = mode === "week" || mode === "day";
  document.getElementById("cal-layout").classList.toggle("timed", timed);
  document.getElementById("cal-times").classList.toggle("hidden", !timed);
  document.getElementById("week-grid").classList.toggle("hidden", mode !== "week");
  document.getElementById("day-grid").classList.toggle("hidden", mode !== "day");
  document.getElementById("month-wrap").classList.toggle("hidden", mode !== "month");
  document.getElementById("year-wrap").classList.toggle("hidden", mode !== "year");
  if (mode === "week") drawTimeGrid("week-grid", 7, startOfWeek(cur));
  if (mode === "day") drawTimeGrid("day-grid", 1, new Date(cur.getFullYear(), cur.getMonth(), cur.getDate()));
  if (mode === "month") drawMonth(document.getElementById("month-wrap"), cur.getFullYear(), cur.getMonth(), true);
  if (mode === "year") {
    const y = document.getElementById("year-wrap");
    y.innerHTML = "";
    for (let m = 0; m < 12; m++) {
      const card = document.createElement("div");
      drawMonth(card, cur.getFullYear(), m, false);
      y.appendChild(card);
    }
  }
}

function drawTimeGrid(id, cols, startDay) {
  const hours = [];
  for (let h = 4; h <= 22; h++) hours.push(h);
  document.getElementById("cal-times").innerHTML = `<div class="time-pad"></div>` + hours.map((h) => `<div class="hour">${hourLabel(h)}</div>`).join("");
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
    const idx = Math.floor(h) - 4;
    const cell = el.querySelectorAll(".cell")[idx];
    if (cell) {
      const line = document.createElement("div");
      line.className = "now-line";
      line.style.top = `${((h % 1) * 56)}px`;
      cell.appendChild(line);
    }
  }
  db.events.forEach((ev) => {
    if (ev.archived || ev.lifecycle === "Deleted") return;
    const st = new Date(ev.startAt);
    const en = new Date(ev.endAt);
    for (let c = 0; c < cols; c++) {
      const day = new Date(startDay); day.setDate(startDay.getDate() + c);
      if (st.toDateString() !== day.toDateString()) continue;
      if (st.getHours() < 4) continue;
      const cells = [...el.querySelectorAll(`.cell[data-d="${day.toDateString()}"]`)];
      const cell = cells[st.getHours() - 4];
      if (!cell) continue;
      const block = document.createElement("div");
      block.className = `block ${statusOf(ev)}`;
      block.style.top = `${(st.getMinutes() / 60) * 56}px`;
      block.style.height = `${Math.max(24, ((en - st) / 3600000) * 56)}px`;
      block.textContent = ev.name;
      block.title = ev.name;
      block.onclick = () => go(`#/edu/event/${ev.id}`);
      cell.appendChild(block);
    }
  });
}

function drawMonth(container, year, month, large) {
  container.className = large ? "month-card month-grid" : "month-card";
  if (year === NOW.getFullYear() && month === NOW.getMonth()) container.classList.add("current");
  const first = new Date(year, month, 1);
  const start = first.getDay();
  const days = new Date(year, month + 1, 0).getDate();
  let cells = "";
  for (let i = 0; i < start; i++) cells += "<span></span>";
  for (let d = 1; d <= days; d++) {
    const isToday = year === NOW.getFullYear() && month === NOW.getMonth() && d === NOW.getDate();
    cells += `<span class="${isToday ? "today" : ""}">${d}</span>`;
  }
  const title = large ? `${MONTHS[month]} ${year}` : MONTHS[month];
  container.innerHTML = `<h3>${title}</h3><div class="dow">${DOW.map((x) => `<span>${x}</span>`).join("")}</div><div class="days">${cells}</div>`;
}

/* ---------- educator detail ---------- */
function renderDetail() {
  const ev = eventBy(ui.route.id);
  if (!ev) return go("#/edu");
  document.getElementById("detail-status").textContent = `${statusOf(ev)} · ${ev.visibility} · ${ev.locationMode}`;
  document.getElementById("detail-title").textContent = ev.name;
  document.getElementById("detail-sub").textContent = `${fmtWhen(ev.startAt)} – ${fmtDate(ev.endAt).time}`;
  document.getElementById("detail-start-room").classList.toggle("hidden", !(ev.enumHostsMeeting && statusOf(ev) !== "Ended" && ev.lifecycle !== "Cancelled"));
  document.getElementById("detail-start-room").textContent = ev.roomOpen ? "Open room" : "Start room";
  document.getElementById("detail-overflow").classList.add("hidden");
  document.querySelectorAll("[data-dtab]").forEach((t) => t.classList.toggle("active", t.dataset.dtab === ui.dtab));
  document.getElementById("panel-overview").classList.toggle("hidden", ui.dtab !== "overview");
  document.getElementById("panel-participants").classList.toggle("hidden", ui.dtab !== "participants");
  const n = goingCount(ev);
  const cap = ev.capacity ? `${n} / ${ev.capacity} going` : `${n} going (unlimited)`;
  document.getElementById("panel-overview").innerHTML = `
    <p>${escapeHtml(ev.description || "No description.")}</p>
    <dl class="meta">
      <div><dt>When</dt><dd>${fmtWhen(ev.startAt)} → ${fmtWhen(ev.endAt)}</dd></div>
      <div><dt>Door</dt><dd>${ev.approval ? "Approval required" : "Open reserve"} · Guest list ${ev.privacy}${ev.ticket === "paid" ? ` · Paid ₦${ev.price}` : " · Free"} · Window ${ev.regWindow || "open"}</dd></div>
      <div><dt>Capacity</dt><dd>${cap}</dd></div>
      <div><dt>Meet</dt><dd>${ev.enumHostsMeeting ? (ev.roomOpen ? "Room open" : "Enum Meet — host has not opened") : (ev.meetingUrl || "No room")}${ev.waitingRoom ? " · Waiting room on" : ""}</dd></div>
      <div><dt>Series</dt><dd>${ev.series || "—"}</dd></div>
      <div><dt>Reminders</dt><dd>${escapeHtml(ev.reminders || "None")} · ${escapeHtml(ev.sms || "email/in-app")}</dd></div>
    </dl>`;
  applyNoShows(ev);
  const statuses = ["All", "Invited", "Going", "Pending", "Waitlisted", "Cancelled", "Checked in", "Unpaid", "No-show"];
  document.getElementById("p-status-tabs").innerHTML = statuses.map((s) => {
    const n = s === "All" ? regsFor(ev.id).length : regsFor(ev.id).filter((r) => r.status === s).length;
    return `<button class="tab ${ui.pFilter === s ? "active" : ""}" type="button" data-pstat="${s}">${s} <span class="count">${n}</span></button>`;
  }).join("");
  const q = (document.getElementById("p-search").value || "").toLowerCase();
  const rows = regsFor(ev.id).filter((r) => {
    if (ui.pFilter !== "All" && r.status !== ui.pFilter) return false;
    const p = person(r.personId);
    return !q || `${p.name} ${p.email}`.toLowerCase().includes(q);
  });
  document.getElementById("p-tbody").innerHTML = rows.length ? rows.map((r) => {
    const p = person(r.personId) || { name: r.personId, email: "", initials: "?" };
    const actions = [];
    if (r.status === "Pending") actions.push(`<button class="btn btn-ghost" data-reg="${r.id}" data-do="approve">Approve</button><button class="btn btn-ghost" data-reg="${r.id}" data-do="decline">Decline</button>`);
    if (r.status === "Waitlisted") actions.push(`<button class="btn btn-ghost" data-reg="${r.id}" data-do="promote">Promote</button>`);
    if (r.status === "Checked in") actions.push(`<button class="btn btn-ghost" data-reg="${r.id}" data-do="reverse">Reverse check-in</button>`);
    return `<tr><td><strong>${escapeHtml(p.name)}</strong><small> ${escapeHtml(p.email)}</small></td><td>${r.status}</td><td>${r.source}</td><td>${r.ticket || "—"}</td><td>${r.smsFailed ? `<span class="fail-pill">${escapeHtml(r.delivery || "SMS failed. Email was sent.")}</span>` : `<span class="ok-pill">${p.sms && db.notify?.sms ? "SMS+email" : "Email/in-app"}</span>`}</td><td>${actions.join(" ")}</td></tr>`;
  }).join("") : `<tr><td colspan="6">No one yet — invite or share the link.</td></tr>`;
}

function renderCheckin() {
  const ev = eventBy(ui.route.id);
  document.getElementById("checkin-sub").textContent = ev.name + " · phone-friendly scan or search";
  document.getElementById("checkin-hint").textContent = ui.cameraDenied
    ? "Allow camera, or search by name."
    : "Camera is simulated. Search always works if the camera is denied.";
  const q = (document.getElementById("scan-name")?.value || "").toLowerCase();
  document.getElementById("checkin-list").innerHTML = regsFor(ev.id).filter((r) => {
    const p = person(r.personId);
    return !q || `${p.name} ${p.email} ${r.ticket}`.toLowerCase().includes(q);
  }).map((r) => {
    const p = person(r.personId);
    return `<tr><td>${escapeHtml(p.name)}</td><td>${r.status}</td><td><button class="btn btn-ghost" data-scan="${r.ticket}" type="button">Check in</button></td></tr>`;
  }).join("") || `<tr><td colspan="3">No matches.</td></tr>`;
}

function doCheckin(code) {
  const ev = eventBy(ui.route.id);
  const flash = document.getElementById("checkin-flash");
  if (document.getElementById("scan-offline")?.checked || ui.checkinOffline) {
    flash.innerHTML = `<p class="err">Connect to check in.</p>`;
    return;
  }
  if (ev.lifecycle === "Cancelled") {
    flash.innerHTML = `<p class="err">This event has been cancelled.</p>`;
    return;
  }
  const q = (code || "").trim();
  const nameQ = (document.getElementById("scan-name")?.value || "").trim().toLowerCase();
  const r = db.registrations.find((x) => x.ticket && x.ticket === q)
    || (nameQ ? db.registrations.find((x) => {
      const p = person(x.personId);
      return x.eventId === ev.id && `${p.name} ${p.email}`.toLowerCase().includes(nameQ);
    }) : null);
  if (!r) { flash.innerHTML = `<p class="err">No match. Allow camera, or search by name.</p>`; return; }
  if (r.eventId !== ev.id) { flash.innerHTML = `<p class="err">This ticket is for a different event.</p>`; return; }
  if (r.status === "Cancelled") { flash.innerHTML = `<p class="err">This ticket was cancelled.</p>`; return; }
  if (r.status === "Checked in") { flash.innerHTML = `<p>Already checked in at ${r.checkedInAt ? fmtWhen(r.checkedInAt) : "earlier"}.</p>`; return; }
  if (!["Going", "Unpaid"].includes(r.status) || (eventBy(r.eventId).ticket === "paid" && !r.paid)) {
    flash.innerHTML = `<p class="err">Payment is incomplete, so you can’t join yet.</p>`; return;
  }
  r.status = "Checked in";
  r.checkedInAt = NOW.toISOString().slice(0, 16);
  save();
  flash.innerHTML = `<p class="ok">Checked in — ${escapeHtml(person(r.personId).name)}.</p>`;
  renderCheckin();
}

function renderSummary() {
  const ev = eventBy(ui.route.id);
  const box = document.getElementById("summary-body");
  const s = db.summary[ev.id];
  if (statusOf(ev) !== "Ended") {
    box.innerHTML = `<article class="card pad">Summary is prepared after the room ends.</article>`;
    return;
  }
  if (!s) {
    box.innerHTML = `<article class="card pad">This session wasn’t recorded, so there’s no summary.</article>`;
    return;
  }
  if (s.status === "processing") {
    box.innerHTML = `<article class="card pad">Preparing the summary of this session…</article>`;
    return;
  }
  if (s.status === "failed") {
    box.innerHTML = `<article class="card pad"><p>Summary unavailable. Retry.</p></article>`;
    return;
  }
  box.innerHTML = `
    <article class="card pad"><label>Summary</label><textarea id="sum-text">${escapeHtml(s.summary)}</textarea></article>
    <article class="card pad"><h3>Key details</h3><ul>${s.key_details.map((k) => `<li>${escapeHtml(k)}</li>`).join("")}</ul></article>
    <article class="card pad"><h3>Action items</h3>${s.action_items.map((a) => {
      const owner = a.owner_user_id && regsFor(ev.id).some((r) => r.personId === a.owner_user_id && r.joined)
        ? person(a.owner_user_id).name : "Unassigned";
      return `<p><strong>${escapeHtml(a.task)}</strong> · ${owner} · ${a.due} ${a.confidence === "low" ? "· low confidence" : ""}</p>`;
    }).join("")}</article>
    <p class="hint">${s.status === "published" ? "Published to attendees." : "Not published until you confirm."}</p>`;
}

function renderGrouping() {
  const ev = eventBy(ui.route.id);
  const joiners = regsFor(ev.id).filter((r) => r.joined);
  const el = document.getElementById("group-wizard");
  if (!joiners.length) {
    el.innerHTML = `<p>No one joined this session, so there’s no one to add to a group.</p>`;
    return;
  }
  if (ev.groupingDismissed) {
    el.innerHTML = `<p>You skipped grouping for this event.</p>`;
    return;
  }
  el.innerHTML = `
    <p>Joiners: ${joiners.map((r) => person(r.personId).name).join(", ")}</p>
    <label>Membership</label>
    <select id="g-mode">
      <option value="one">One group for everyone</option>
      <option value="per"${ev.hadBreakouts ? "" : " disabled"}>One group per breakout</option>
      <option value="both"${ev.hadBreakouts ? "" : " disabled"}>Both</option>
    </select>
    <label>Chat policy</label>
    <select id="g-chat">
      <option value="include">Include in-call chats in the Community group(s)</option>
      <option value="admin">Admin only — members cannot create groups from calls</option>
      <option value="drop">Breakout chats — keep members, drop those transcripts</option>
    </select>
    <div class="${ev.hadBreakouts ? "" : "hidden"}" id="g-multi-wrap">
      <label>People who sat in more than one breakout: create a group per breakout?</label>
      <select id="g-multi"><option value="yes">Yes — multiple chats, history for everybody</option><option value="no">No — one group, history only for those breakout members</option></select>
    </div>
    <label>Group name</label>
    <input id="g-name" value="${escapeHtml(ev.name)} — plenary" />
    <div class="cta-row">
      <button class="btn btn-ghost" type="button" id="g-skip">Dismiss</button>
      <button class="btn btn-primary" type="button" id="g-go">Create groups</button>
    </div>`;
  document.getElementById("g-skip").onclick = () => { ev.groupingDismissed = true; save(); toast("Grouping skipped."); go(`#/edu/event/${ev.id}`); };
  document.getElementById("g-go").onclick = () => {
    const mode = document.getElementById("g-mode").value;
    const chat = document.getElementById("g-chat").value;
    const name = document.getElementById("g-name").value.trim() || ev.name;
    const members = joiners.map((r) => r.personId);
    members.push("p-ada");
    if (mode === "one" || document.getElementById("g-multi")?.value === "no") {
      db.groups.push({ id: "g" + Date.now(), name, members: [...new Set(members)], eventId: ev.id, chat });
    } else {
      ["Breakout A", "Breakout B"].forEach((b, i) => {
        db.groups.push({ id: "g" + Date.now() + i, name: `${ev.name} — ${b}`, members: i === 0 ? ["p-james", "p-ada"] : ["p-ada"], eventId: ev.id, chat });
      });
      if (mode === "both") db.groups.push({ id: "g" + Date.now() + "p", name, members: [...new Set(members)], eventId: ev.id, chat });
    }
    ev.groupingDismissed = true;
    save();
    toast("Groups created in Community.");
    go("#/community");
  };
}

function renderInsights() {
  const ev = eventBy(ui.route.id);
  const regs = regsFor(ev.id);
  const going = regs.filter((r) => ["Going", "Checked in"].includes(r.status)).length;
  const checked = regs.filter((r) => r.status === "Checked in").length;
  document.getElementById("insights-grid").innerHTML = [
    ["Views", ev.views || 0],
    ["Reserve starts", regs.length],
    ["Going", going],
    ["Check-in rate", going ? Math.round((checked / going) * 100) + "%" : "—"],
    ["Join starts", regs.filter((r) => r.joined).length]
  ].map(([k, v]) => `<article class="card pad"><div class="card-head">${k}</div><div class="big" style="font-size:28px">${v}</div></article>`).join("");
  document.getElementById("roles-list").innerHTML = db.roles.map((role) =>
    `<p>${person(role.personId).name} — ${role.role}</p>`).join("") +
    `<p class="hint">Keep at least one owner. Embed reserve uses the same door as Feature 1.</p>
     <label>Custom slug</label><input id="slug" value="${ev.id}" /><button class="btn btn-ghost" type="button" id="slug-save">Save link</button>`;
  document.getElementById("slug-save").onclick = () => {
    const v = document.getElementById("slug").value.trim();
    if (db.events.some((e) => e.id !== ev.id && e.slug === v)) { toast("That link is already in use."); return; }
    ev.slug = v; save(); toast("Link saved.");
  };
}

/* ---------- talent (as-built) ---------- */
