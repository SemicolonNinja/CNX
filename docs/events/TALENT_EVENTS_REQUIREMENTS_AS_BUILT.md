# Enumverse Talent Events — As-Built Requirements

> **Purpose:** Spec of the **existing** Talent-side Events / Calendar experience so Cursor/Grok can implement against live UI without guessing.  
> **Source of truth:** Live UI on `talent.dev.enumverse.com`, explored 2026-09-15 after switching via top-left **JI** avatar → **Talent**.  
> **Companion doc:** [Educator/admin as-built](EVENTS_REQUIREMENTS_AS_BUILT.md) (`educator.dev.enumverse.com/admin/events`).  
> **Do not invent:** Features under “Not in current build” must not be treated as live. Cancel reservation, tickets, and Discover/Going/Past as a product split belong to the [PRD](../enum-events-meet-prd.md), not this file.

---

## 1. Product context

| Item | Value |
|------|--------|
| Product | Enumverse Talent |
| How to reach | From educator shell: click **JI** (top-left) → dropdown → **Talent** (vs Organization) |
| Base URL | `https://talent.dev.enumverse.com` |
| Discovery Events | `/talent/event` |
| Event detail | `/talent/event/{id}` |
| Calendar | `/talent/calendar` |
| Calendar event tracker | `/talent/calendar/events?status=UPCOMING` (and other statuses) |
| My reserved event detail | `/talent/calendar/{id}?myEvent=true&from=events&status=UPCOMING` |
| Actor | Authenticated talent user |

**Role split:** Educator admin **creates/manages** events. Talent **discovers, reserves, calendars, joins meet links**. No Talent create-event control observed.

---

## 2. Surfaces

1. **Discovery Events** — browse/search/filter public (or visible) events; open detail via **View**.
2. **Event detail** — status, meta, Reserve / Reserved, Copy link, Enum meet (virtual).
3. **Calendar** — Day/Week/Month/Year; tracks talent’s reserved/assigned events; Upcoming/Ongoing/Ended tabs in grid tracker.

---

## 3. Domain model (Talent-facing)

| Field / concept | Notes |
|-----------------|--------|
| title, category | On cards and detail |
| host | Org/host name (e.g. Jamesbond Inc.) |
| startAt / endAt | Displayed on cards and detail |
| locationMode | Physical \| Virtual \| Hybrid |
| locationDetails | Address/map for physical; **Enum meet** link for virtual |
| status | Upcoming \| Ongoing \| Ended (Closed on ended detail) |
| reservation | Talent may **Reserve a spot**; once reserved, button **Reserved** (disabled); no unreserve UI observed |
| share | **Copy link** → toast “Link copied!”; disabled on some ended events |

---

## 4. UI — Discovery (`/talent/event`)

![Talent discovery list](as-built-ui/talent/02-talent-events-list.png)

![Location filters](as-built-ui/talent/03-talent-events-location-filters.png)

![Date filters](as-built-ui/talent/04-talent-events-date-filters.png)

### Controls
- **Search** events.
- **Filters:**
  - Location: Physical, Virtual, Hybrid
  - Date: Today, This week, This month
- Event **cards:** category, title, dates, location, host, **View** CTA.

### Not on discovery
- No create event.
- No pagination control observed on this pass.
- No tickets / RSVP form wording on list.

### Sample observed events
- “Ay Live”
- “Test not logged in.”

Dashboard after JI → Talent:

![Talent dashboard](as-built-ui/talent/01-talent-dashboard.png)

---

## 5. UI — Event detail (`/talent/event/{id}`)

![Ay Live — Reserve a spot](as-built-ui/talent/05-ay-live-event-detail.png)

![Team Culture Fit — Reserved](as-built-ui/talent/09-team-culture-fit-detail.png)

![Ended Book reader — Closed](as-built-ui/talent/10-ended-book-reader-detail.png)

### Content
- Status (e.g. Upcoming)
- Category, host
- Start / end date and time
- Location (Virtual → Enum meet link; Physical → address/map when present)
- Description / tags when present

### Actions
| Action | Behaviour |
|--------|-----------|
| **Reserve a spot** | Primary reserve when available |
| **Reserved** (disabled) | Already reserved (e.g. Team Culture Fit) |
| **Copy link** | Copies share URL; confirmation “Link copied!” |
| Enum meet | Opens/hosts meeting for virtual events |

### Ended behaviour (observed: “Book reader”)
- Shows **Closed**
- Reserve disabled; Copy link disabled
- Physical address/map, description, host, tags still visible

---

## 6. UI — Calendar (`/talent/calendar`)

![Calendar day](as-built-ui/talent/06-talent-calendar-day.png)

![Calendar month](as-built-ui/talent/07-talent-calendar-month.png)

![Calendar upcoming — Team Culture Fit](as-built-ui/talent/08-talent-calendar-upcoming-team-culture-fit.png)

![Calendar ended + filters](as-built-ui/talent/11-calendar-ended-filters.png)

### Controls
- Range: **Day \| Week \| Month \| Year**
- **Today** + previous/next navigation
- Legend: Upcoming / Ongoing / Ended
- Calendar vs grid views
- Grid tracker: tabs **Upcoming / Ongoing / Ended** with counts; search; Location/Date filters (same family as discovery)

### Behaviour
- Calendar shows talent’s reserved/assigned events (e.g. Team Culture Fit with `myEvent=true`).
- Opening a calendar event goes to talent event detail with reservation state.

---

## 7. Functional requirements

### FR-T1 Discover
Talent can search and filter events by location and date, then open detail via View.

### FR-T2 Reserve
Talent can reserve a spot when available; reserved state is visible and non-editable (no cancel/unreserve in UI).

### FR-T3 Share
Talent can copy an event link (when enabled); toast confirms copy.

### FR-T4 Meet
For virtual events, talent can access **Enum meet**.

### FR-T5 Calendar
Talent can navigate Day/Week/Month/Year and see reserved events under Upcoming/Ongoing/Ended.

---

## 8. Explicitly NOT in Talent build (this pass)

- Create / edit / delete events
- Ticketing / payment / paywall UI
- Separate RSVP form
- Cancel / unreserve
- Waitlist / capacity UI
- Attendance taking
- Educator admin metrics/menus

---

## 9. vs Educator admin (summary)

See also [educator as-built](EVENTS_REQUIREMENTS_AS_BUILT.md).

| Capability | Educator (`/admin/events`) | Talent |
|------------|----------------------------|--------|
| Create event | Yes | No |
| Edit / kebab admin | Yes | No |
| Metrics cards | Yes | No |
| Discover / View | N/A (admin list) | Yes |
| Reserve a spot | N/A | Yes |
| Copy link | Share-ish admin | Yes (talent) |
| Enum meet | Host toggle on create | Consume link |
| Calendar | Admin calendar | Talent calendar of reserved events |

---

## 10. Acceptance checklist

- [ ] JI → Talent reaches `talent.dev.enumverse.com`
- [ ] `/talent/event` search + location/date filters + View cards
- [ ] Detail: Reserve / Reserved, Copy link, Enum meet when virtual
- [ ] Ended: Closed; reserve/copy disabled as observed
- [ ] `/talent/calendar` Day/Week/Month/Year + Upcoming/Ongoing/Ended
- [ ] No create on Talent

---

## 11. Screenshots

All files in [`as-built-ui/talent/`](as-built-ui/talent/).

| File | Contents |
|------|----------|
| [`01-talent-dashboard.png`](as-built-ui/talent/01-talent-dashboard.png) | Talent dashboard after switch |
| [`02-talent-events-list.png`](as-built-ui/talent/02-talent-events-list.png) | Discovery list |
| [`03-talent-events-location-filters.png`](as-built-ui/talent/03-talent-events-location-filters.png) | Location filters |
| [`04-talent-events-date-filters.png`](as-built-ui/talent/04-talent-events-date-filters.png) | Date filters |
| [`05-ay-live-event-detail.png`](as-built-ui/talent/05-ay-live-event-detail.png) | Detail + Reserve a spot |
| [`06-talent-calendar-day.png`](as-built-ui/talent/06-talent-calendar-day.png) | Calendar day |
| [`07-talent-calendar-month.png`](as-built-ui/talent/07-talent-calendar-month.png) | Calendar month |
| [`08-talent-calendar-upcoming-team-culture-fit.png`](as-built-ui/talent/08-talent-calendar-upcoming-team-culture-fit.png) | Calendar upcoming |
| [`09-team-culture-fit-detail.png`](as-built-ui/talent/09-team-culture-fit-detail.png) | Reserved (disabled) |
| [`10-ended-book-reader-detail.png`](as-built-ui/talent/10-ended-book-reader-detail.png) | Ended/Closed detail |
| [`11-calendar-ended-filters.png`](as-built-ui/talent/11-calendar-ended-filters.png) | Calendar ended + filters |

---

*End of Talent as-built. Prefer live UI if it diverges after a product update.*
