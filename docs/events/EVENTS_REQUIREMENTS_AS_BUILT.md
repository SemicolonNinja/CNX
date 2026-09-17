# Enumverse Events — As-Built Requirements

> **Purpose:** Spec of the **existing** Events / Calendar experience on Enumverse educator admin so an agent (Cursor / Grok) can reimplement or extend it without guessing.  
> **This is not the whole Events programme.** Live Talent discovery/reserve/calendar is in [Talent as-built](TALENT_EVENTS_REQUIREMENTS_AS_BUILT.md) (switch via top-left **JI** → **Talent**). Tickets, cancel reservation, Meet room, and the next build are in [PRD v1.1](../enum-events-meet-prd.md), the [UI overlay](../events-existing-ui-overlay.md), and the [repo README](../../README.md).  
> **Source of truth:** Live UI on `educator.dev.enumverse.com` (admin), explored 2026-09-15. Screenshots in [`as-built-ui/`](as-built-ui/).  
> **Out of scope for this doc:** Team, Applications, Assessments, Programs, Courses, Question banks, Community — except where Events links to them (none confirmed). Talent surfaces are documented separately.  
> **Do not invent:** Features listed under “Not in current build” must not be implemented as if they already exist unless product explicitly expands scope.  
> **Does not replace:** [Events & Meet PRD v1.1](../enum-events-meet-prd.md) (future door / room / after). This file is live-as-built educator only.

---

## 1. Product context

| Item | Value |
|------|--------|
| Product | Enumverse (educator admin) |
| Module name in nav | **EVENTS** |
| Page title | **Calendar** |
| Page subtitle | View and track your events, meetings and availability. |
| Primary URL pattern | `/admin/events` (observed: `educator.dev.enumverse.com/admin/events`) |
| Actor | Authenticated admin / educator (example session: org user “James”) |
| Role switch | Top-left **JI** avatar → Organization (this admin) vs **Talent** (`talent.dev.enumverse.com`) — see [Talent as-built](TALENT_EVENTS_REQUIREMENTS_AS_BUILT.md) |
| Related dashboard | `/admin/dashboard` shows event counts + Upcoming widget |

---

## 2. Information architecture

### 2.1 Global shell (shared)

- **Left icon rail** (top → bottom): org/user mark → **HOME** → **TEAM** → **EVENTS** (active when on this module) → **COMMUNITY** → **NOTIFICATIONS** → **PROFILE** → **PEOPLE & SETTINGS** → (footer) user avatar + logout.
- Active module: light blue highlight on Events.
- Floating **support chat** bubble, bottom-right (global; not Events-specific).

### 2.2 Events module surfaces

1. **Events list** (default) — status tabs + table + filters + search.
2. **Calendar view** — Day / Week / Month / Year grid.
3. **Create event** modal (overlay on list/calendar).
4. **Edit event** — same form pattern as create, prefilled (opened via row overflow).
5. **Dashboard hooks** — Upcoming widget; `+ Create` → Event.

---

## 3. Domain model (minimal)

### 3.1 Event

| Field | Required | Notes |
|-------|----------|--------|
| `id` | yes | System |
| `name` / title | yes | Shown as primary label; initials avatar (e.g. “TC”) when no image |
| `description` | no | Shown under name in list when present |
| `coverImage` | no | PNG/JPEG, max 5MB |
| `visibility` / type | yes | `Public` \| `Private` |
| `category` | ? | Dropdown “Select a category” (exact enum TBD from API) |
| `locationMode` | yes | `Physical` \| `Virtual` \| `Hybrid` |
| `locationDetails` | conditional | Physical address/place and/or online meeting URL/details |
| `startAt` | yes | Date + time |
| `endAt` | yes | Date + time (≥ start) |
| `status` | derived or stored | `Upcoming` \| `Ongoing` \| `Ended` \| `Cancelled` |
| `guests` | no | Invite list (“Add guest”) |
| `reminders` | no | Configurable reminder options |
| `enumHostsMeeting` | no | Boolean — “Allow Enum to host your meeting” (online) |
| `createdBy` / org | yes | Tenant-scoped |

### 3.2 Participant (aggregate)

| Concept | Notes |
|---------|--------|
| Invited | Count of invitees across events (dashboard: 3 invited) |
| Registered | Separate count (dashboard: 0 registered) — registration flow **not** exposed in Events UI on this pass |

### 3.3 Status rules (observed behaviour)

- Tabs and summary cards partition events into Upcoming / Ongoing / Ended / Cancelled.
- Exact clock-boundary rules (timezone, “ongoing” window) should match backend; UI must keep tab counts and summary cards in sync after create/edit/cancel.

---

## 4. UI requirements — Events list

![Events list, Upcoming tab](as-built-ui/events-list-upcoming.png)

![Events list, Ended tab](as-built-ui/events-list-ended.png)

![Events list, current state](as-built-ui/events-list-current.png)

### 4.1 Page header

- **H1:** Calendar  
- **Subtitle:** View and track your events, meetings and availability.  
- **Primary CTA (top-right):** blue button `+ Create event`

### 4.2 Summary cards (two)

**Card A — All events**

- Large total count.
- Sub-metrics inline: `Upcoming: N` · `Ongoing: N` · `Ended: N` · `Cancelled: N`

**Card B — All participants**

- Large total count.
- Sub-metrics: `Invited: N` · `Registered: N`

### 4.3 Status tabs

| Tab | Shows |
|-----|--------|
| Upcoming (count) | Future events |
| Ongoing (count) | In-progress |
| Ended (count) | Past |
| Cancelled (count) | Cancelled |

- Active tab: blue underline.
- Switching tab filters the table (and counts stay consistent with cards).

### 4.4 Toolbar (right of tabs)

![Filter by → Date submenu](as-built-ui/events-filters.png)

1. **Filter by** — opens nested menu:
   - **Type of event** → Public, Private  
   - **Location** → Physical, Virtual, Hybrid  
   - **Date** → Today, Yesterday, This week, Last week, This month, Last month  
2. **Search** — placeholder `Search event` (filters by name; description match TBD).  
3. **View toggle** — List (active default) | Calendar.

### 4.5 Table columns

| Column | Content |
|--------|---------|
| Event name / description | Avatar (image or initials) + **bold title** + optional description snippet |
| Type of event | Pill: **Public** (globe) or **Private** (lock) |
| Location | Text: Physical / Virtual / Hybrid |
| Start date/time | Two lines preferred: `DD, Month YYYY` + `HH:MM AM/PM` |
| End date/time | Same format |
| Action | Vertical kebab (⋯) |

**Kebab actions (observed):** open **Edit** (and any other items present in live menu — implement what API returns; do not invent Cancel Event unless confirmed in UI).

### 4.6 Pagination

- Label: `Page X of Y`
- Page size control: e.g. `10 per page` (dropdown)
- Page number chip(s)
- `Previous` / `Next` — disabled at ends

### 4.7 Empty / zero states

- Tabs with zero count still render; no special empty-state copy observed beyond empty table body.

---

## 5. UI requirements — Calendar view

![Calendar week](as-built-ui/calendar-week.png)

![Calendar day](as-built-ui/calendar-day.png)

![Calendar year](as-built-ui/calendar-year.png)

### 5.1 Control bar

- Prev / next chevrons to move range
- Date-range dropdown (e.g. `Sep 13 – 19, 2026` for a Sunday-start week containing Sep 15)
- Legend: blue = Upcoming, green = Ongoing, red = Ended
- View dropdown: **Day** | **Week** | **Month** | **Year**
- Same List | Calendar toggle (Calendar active)

### 5.2 Grid

- **Week:** columns = **Sunday → Saturday**; rows = hours (from 4 AM upward). Range label covers that Sunday–Saturday window.
- **Year:** month cards; weekday headers **S M T W T F S** (Sunday start). Current month uses a blue header and today chip.
- `+ Create event` remains available.

### 5.3 Acceptance

- Switching Day/Week/Month/Year updates grid and range label.
- Events appear on correct day/time slots from `startAt`/`endAt`.

---

## 6. UI requirements — Create event modal

![Create event modal (top)](as-built-ui/create-event-top.png)

**Pattern:** Centered modal over dimmed Events page. Title: `Create event`. Close via `X` or `Cancel`.

### 6.1 Sections / fields (top → bottom)

1. **Visibility segmented control**  
   - Options: **Public** | **Private**  
   - Icons: public (open) / private (lock)  
   - Default: match product (observed default leaned Public in empty create)

2. **Cover image**  
   - Dashed upload area  
   - Copy: `Upload your image` / `PNG or JPEG format • Max. 5MB`  
   - Button: `Upload`

3. **Event name\***  
   - Placeholder: `Enter event title`  
   - Required

4. **Category**  
   - Placeholder: `Select a category`  
   - Dropdown (options from API)

5. **Description**  
   - Placeholder: `Type details of this event`  
   - Multiline

6. **Start / end date and time** (below fold in scrollable modal — required for a valid event)

7. **Location mode**  
   - Physical | Virtual | Hybrid  
   - Show mode-specific detail fields (place / meeting link / both for Hybrid)

8. **Guests**  
   - Control labelled like `Add guest`

9. **Reminders**  
   - Selectable reminder options (exact presets from API)

10. **Online hosting**  
    - Toggle: `Allow Enum to host your meeting` (relevant when Virtual/Hybrid)

### 6.2 Footer actions

- `Cancel` — secondary; closes without save  
- `Create event` — primary; **disabled** until required fields satisfied (observed greyed until name etc. filled)

### 6.3 Edit mode

- Same modal/form as create  
- Title becomes edit equivalent (or same form with prefilled values)  
- Prefilled from existing event  
- Discard via Cancel without persisting changes  

---

## 7. Entry points (must all work)

| Entry | Behaviour |
|-------|-----------|
| Events page `+ Create event` | Opens Create event modal |
| Dashboard Upcoming `+ Add event` | Opens Create event |
| Dashboard top `+ Create` → **Event** | Opens Create event |
| Row kebab → Edit | Opens edit with prefilled event |

Dashboard `+ Create` also lists unrelated entities (Application, Assessment, Question bank, Program, Course, Form) — **not** part of Events requirements beyond the Event item.

---

## 8. Functional requirements (behaviours)

### FR-1 List & filter
- User can filter by status tab, type, location, date preset, and search text.
- Filters compose (AND) unless product specifies otherwise.
- Results update summary cards only when global; tab counts reflect filtered or global set per current product behaviour (match live API).

### FR-2 Create
- User can create Public/Private events with Physical/Virtual/Hybrid location.
- Validation: name required; create button disabled until minimum valid set complete.
- On success: modal closes; event appears in correct status tab; counts increment.

### FR-3 Edit
- User can edit an existing event and save (or cancel without save).

### FR-4 Calendar
- User can switch Day/Week/Month/Year and navigate ranges; events visible on calendar.

### FR-5 Guests & reminders
- User can add guests and configure reminders on create/edit.
- Participant summary reflects invites (Invited vs Registered).

### FR-6 Enum-hosted meeting
- For online-capable events, user can enable Enum to host the meeting.

---

## 9. Explicitly NOT in current build

Do **not** implement these as existing product unless a new PR expands scope:

- Recurrence / series
- External calendar sync (Google/Outlook)
- Dedicated attendance taking UI
- RSVP management screen
- Waitlist / capacity
- Recording management
- Registration checkout / public registration portal (Registered count exists; flow not in Events admin UI on this pass)
- Bulk select / bulk actions on list
- Deep links from Events → Applications / Assessments / Programs

---

## 10. Visual / UX constraints (for faithful rebuild)

- Light SaaS theme: white / light grey surfaces, **royal blue** primary (`~#0052CC` family) for CTA, active tab, active nav.
- Rounded corners on cards, inputs, buttons, modal.
- Clean sans-serif typography.
- Public/Private as **pills/tags** with icons.
- List default; calendar secondary.
- Modal create: primary CTA disabled until valid.

---

## 11. Acceptance checklist (agent-friendly)

- [ ] `/admin/events` shows Calendar title, subtitle, `+ Create event`, two summary cards, four status tabs.
- [ ] Upcoming/Ongoing/Ended/Cancelled filter the table; counts match.
- [ ] Filter by Type, Location, Date presets works; Search event works.
- [ ] List ↔ Calendar toggle; Calendar Day/Week/Month/Year + range nav + legend.
- [ ] Create modal: Public/Private, image upload rules, name*, category, description, start/end, location mode + details, guests, reminders, Enum host toggle; Cancel / Create event (disabled until valid).
- [ ] Edit via kebab; Cancel discards.
- [ ] Dashboard Add event / Create → Event open same create flow.
- [ ] No features from §9 unless explicitly requested.

---

## 12. Reference assets

| File | Contents |
|------|----------|
| [`as-built-ui/events-list-upcoming.png`](as-built-ui/events-list-upcoming.png) | List + Upcoming tab |
| [`as-built-ui/events-list-ended.png`](as-built-ui/events-list-ended.png) | Ended tab rows (Public/Private, Physical/Virtual) |
| [`as-built-ui/events-list-current.png`](as-built-ui/events-list-current.png) | List state |
| [`as-built-ui/events-filters.png`](as-built-ui/events-filters.png) | Filter by → Date submenu |
| [`as-built-ui/create-event-top.png`](as-built-ui/create-event-top.png) | Create modal (visibility, image, name, category, description) |
| [`as-built-ui/calendar-day.png`](as-built-ui/calendar-day.png) | Calendar day |
| [`as-built-ui/calendar-week.png`](as-built-ui/calendar-week.png) | Calendar week |
| [`as-built-ui/calendar-year.png`](as-built-ui/calendar-year.png) | Calendar year |

---

## 13. Sample seed (from live tenant — illustrative)

- **Team Culture Fit** — Private, Virtual, start 07 Sept 2026 03:30 PM, end 07 Sept 2026 05:00 PM, Upcoming.
- Additional ended events exist (e.g. public physical test events, private virtual “Book reader”) — use only as UI examples, not hard-coded product copy.

---

*End of as-built requirements. Prefer matching live UI over this doc if they diverge after a product update; re-capture screenshots and amend §4–§6.*
