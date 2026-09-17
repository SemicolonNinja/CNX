# Events — existing experience overlay

| Field | Value |
|---|---|
| Document | Events UI overlay (EFX) |
| Version | v1.0 |
| Constraint | **Do not change the UI.** New behaviour attaches to existing screens, tabs, modals, buttons, badges, and overflow items. Same layout, type, colour, and component patterns. No new destinations, no new visual language, no Luma restyle. |
| Pairs with | Events & Meet PRD (EFX) v1.1 |
| Source of inventory | Live educator + talent Events on `*.dev.enumverse.com` (prior authenticated pass in this project). Computer-use was not available on this turn; re-walk the open Desktop session against this inventory before build if anything has drifted. |

## Rule for builders

If a PRD need can live in an existing control, it must. If a control is missing, add the **smallest** existing-pattern sibling (another row in the create modal, another overflow item, another status badge, another tab next to Upcoming / Ongoing / Ended — not a new app).

Meet in-room chrome does not exist today beyond an “Enum meet” link. That is the only place a surface may appear, and it must reuse Enum’s existing video/chat patterns if Community or Meet already has them — not a new product look.

---

# Part A — Extracted existing experience

## A1. Educator — Events list

**URL:** `https://educator.dev.enumverse.com/admin/events`  
**Nav:** sidebar **Events**  
**Page title:** **Calendar** (label mismatch; keep it — do not rename in this build)

**Chrome already there**

- Stats: event totals by Upcoming / Ongoing / Ended / Cancelled; participant totals Invited / Registered
- List / grid toggle
- Primary: **Create event**
- Event rows/cards: cover, name, schedule, location type, status badge, participant count
- Overflow on an event: open, **Copy link**, **Share**, **Duplicate**, **Edit guest list**, **Delete event**

**Assessment:** This is the host home. Do not add a new dashboard. PRD Insights, roles, series, and lifecycle actions hang off this page and the event detail already opened from it.

## A2. Educator — Create event (modal)

**Entry:** **Create event**  
**Pattern:** single modal, one **Create event** submit (publishes immediately). Public / Private toggle. Image. Name*. Category (fixed set). Description (2 000). Start / end. Physical / Virtual / Hybrid. Location*. Guest list. Tags. Reminder dropdown.

**Assessment:** All new authoring fields (capacity, questions, approval, waitlist, guest-list privacy, tickets, Join window, SMS/email reminder timing) are **additional rows inside this modal and the later Edit surface**, using the same labels, spacing, and controls (toggle, dropdown, text field). Do not replace the modal with a multi-step wizard or a Luma single-page editor.

## A3. Educator — Event detail

**Tabs already there:** **Overview** | **Participants**  
**Actions already there:** **Edit**, **Copy link**, overflow (**Share**, **Duplicate**, **Edit guest list**, **Delete event**), status badge  
**Participants:** list + count (Invited / Registered language already in list stats)

**Assessment:** This is the host operating system. Check-in, invites, CSV import/export, blasts, approval queue, waitlist, tickets, recording/summary, grouping wizard all attach here as **the same tabs + overflow + Edit**, not new top-level nav.

## A4. Educator — Delete / closed

Delete is refused unless cancelled (“Only cancelled events can be deleted”) but Cancel is not a first-class overflow action.

**Assessment:** Add **Cancel event** and **Archive** as overflow siblings of **Delete event**. Do not invent a settings graveyard page.

## A5. Public / talent event page

**URL pattern:** `https://talent.dev.enumverse.com/talent/event/{id}` (also `events-details/{id}` observed)  
**Already there:** banner, title, Upcoming (or Closed) badge, category, host, **Reserve a spot**, **Copy link**, start/end, Physical/Virtual/Hybrid, address, **Enum meet** link, description, tags, map.

**Reserve:** Confirm reservation modal → success modal (“Reservation successful… added to your calendar”) + toast → CTA becomes disabled **Reserved**.

**Assessment:** Talent never gets a new event-page layout. PRD Join, ticket, cancel, remaining spots, Requested/Waitlisted, You’re going — all **replace or extend the existing primary CTA and success modal**, same placement.

## A6. Talent — Browse

**URL:** `/talent/event`  
**Copy:** “Events - Discover festivals, meetups and workshops you can join”  
**Already there:** search; Filter by Physical / Virtual / Hybrid; Today / This week / This month; cards with banner, category, title, dates, location type, host, **View**.

**Assessment:** Discover stays this page. **Going** and **Past** are not a new product — they already exist as Calendar tabs (`Upcoming` / `Ended` / `Ongoing`). Overlay: either (a) reuse those Calendar tabs as the Going/Past surfaces, or (b) add the **same tab component** already used on Calendar onto `/talent/event` without restyling. Prefer (a) to avoid duplicate chrome: sidebar **Events** = Discover; sidebar **Calendar** Upcoming/Ended = Going/Past. If product insists on tabs on Events, clone Calendar’s tab bar exactly.

## A7. Talent — Calendar

**URLs:** `/talent/calendar` ; `/talent/calendar/events?status=UPCOMING|ONGOING|ENDED`  
**Already there:** day/week grid; event blocks; popover (title, time, location, meeting link, host); Upcoming / Ongoing / Ended counts; search; filter; grid/list.

**Assessment:** `.ics` / add-to-calendar and View ticket hang on the **existing popover** and event detail, not a new calendar product.

## A8. Talent — Dashboard widget

Events count + “Events today” mini list (time rendering has been wrong vs detail).

**Assessment:** Fix time source only. Do not redesign the widget.

## A9. Notifications

Settings already have **Events**: “Event invitations, reminders, and changes” with in-app / email / frequency.

**Assessment:** SMS is one more toggle in that **existing Events notification row**, not a new settings page.

---

# Part B — Assessment vs PRD

| PRD | Existing UI home | Gap if we do not overlay |
|---|---|---|
| F1 Cancel reservation | Disabled **Reserved** on detail | Trap; add Cancel next to existing CTA |
| F1 `.ics` | Success copy claims calendar; Enum calendar only | Add download/actions on **existing success modal** (already has share icons) |
| F1 Discover vs Going | Events browse vs Calendar Upcoming | Do not invent a third list; bind Going = Calendar Upcoming |
| F1 Timezone | Times without TZ; dashboard mismatch | Same timestamps, add TZ abbreviation — no layout change |
| F2 Ticket / check-in | No artefact; Participants tab exists | **View ticket** as secondary next to Copy link; Check in as Participants toolbar using existing table |
| F3 Capacity / questions / CSV | Create modal + Participants | Extra fields in modal; Export on Participants (same place as Edit guest list) |
| F4 Cancel/archive/delete | Delete only | Overflow items only |
| F5 Email/SMS | Reminder dropdown on create; notification settings | Keep dropdown; wire real sends; SMS in existing Events settings row |
| F6 Privacy, invites, CSV import | **Edit guest list** | That action is the home for privacy + invite + import |
| F7 Approval, waitlist, blasts, tickets | Participants + create modal | Pending/Waitlist as **filters on Participants** (same pattern as Upcoming/Ended). Tickets as rows in create/edit. Send message from Participants (forms-send pattern already on platform). |
| F8 Join / room | **Enum meet** text link | Promote that control to the existing primary/secondary CTA slot when virtual/hybrid and live; room uses existing Meet if any, else current page chrome |
| F9 Summary | Nothing | Host: new section **inside Overview**, not a new tab, unless Overview is already dense — then a third tab **Notes** matching Overview/Participants styling exactly |
| F10 Grouping | Nothing; Community exists elsewhere | Post-call **modal** matching Confirm reservation / Create-success modals; targets existing Community groups |
| F11 Roles, insights, embed, series | Overflow + stats on list | Team on Edit; Insights as extra stats on list/detail (same stat chips); embed next to Copy link; series = Duplicate + dates in edit |

**Already shipped — do not rebuild:** reserve modal, copy link, share, duplicate, categories, tags, map, hybrid type, calendar Upcoming/Ended, notification Events category.

---

# Part C — Plug PRD into existing controls (no UI change)

## Feature 1 — Reservation loop

| Requirement | Existing control | Overlay (no new look) |
|---|---|---|
| Cancel | Disabled **Reserved** | Enable a text-button sibling using the same outline style as **Copy link**: label **Cancel reservation**. Confirm uses the **Confirm reservation** modal shell (title, body, Cancel / primary). |
| You’re going | **Reserved** | Keep the same button geometry; label **You’re going** (disabled or tertiary). Do not add a new badge system — Upcoming/Closed badges already exist. |
| `.ics` / Google / Apple | Success modal share row (X, LinkedIn, Facebook) | Add calendar actions **in that same icon/button row**. Copy: “Reserved. This is on your Enum calendar.” |
| Discover vs Going | `/talent/event` vs Calendar **Upcoming** | Going = Calendar Upcoming; Past = Calendar Ended. Do not add Events-page tabs unless Calendar tabs are cloned 1:1. |
| Timezone | Date lines on detail, cards, calendar, dashboard | Append `WAT` (or event TZ) to existing date string. Fix dashboard to the same formatter as detail. |

## Feature 2 — Tickets and check-in

| Requirement | Existing control | Overlay |
|---|---|---|
| View ticket | **Copy link** slot on talent detail | Secondary button **View ticket** in the same pair as Copy link. Ticket is a **modal** (same as Confirm reservation): QR, name, event, status. |
| Check in | Educator **Participants** tab | Toolbar on that table: search (if missing, use Calendar’s **Search event** field) + **Check in** opening camera in a modal. Success = existing green toast pattern (“Successfully registered for event”). |
| Statuses | Invited / Registered stats | Map Registered → Going; add Checked in / No-show as **status badges already used for Upcoming/Ended**. |

## Feature 3 — Registration controls

| Requirement | Existing control | Overlay |
|---|---|---|
| Capacity, open/close | Create/Edit modal | New fields after location, same input style as Name/Location. Remaining spots = helper text under the existing Reserve button, not a new card. |
| Questions | Create/Edit modal | Repeater below description, same as Tags. Talent sees them **inside Confirm reservation** before Yes, reserve. |
| CSV export | **Edit guest list** / Participants | **Export CSV** next to Edit guest list (same overflow or text button). |
| Public states | **Reserve a spot** / **Reserved** / Closed | Swap label only: Event full, Registration closed, Requested, Waitlisted — same button. |

## Feature 4 — Lifecycle

| Requirement | Existing control | Overlay |
|---|---|---|
| Cancel event | Overflow **Delete event** | Insert **Cancel event** above Delete. Confirm modal = existing delete/confirm pattern. |
| Archive | Overflow | **Archive** below Cancel. |
| Recovery copy | Toast “Only cancelled events can be deleted” | Same toast; add the **Cancel event** action in the toast or overflow — do not new page. |

## Feature 5 — Communications

| Requirement | Existing control | Overlay |
|---|---|---|
| Email templates | Create **Reminder** dropdown | Keep dropdown; values 24h / 1h / off drive Feature 5 sends. Preview = existing settings surface, not a campaign builder UI. |
| SMS | Settings → Events notification row | Third toggle beside In-app and Email. Frequency already there. |
| Failure | Participants | Failed SMS/email as a column or badge on the existing list, not a new delivery app. |

## Feature 6 — Privacy, invites, import

| Requirement | Existing control | Overlay |
|---|---|---|
| Guest-list privacy | Public/Private toggle + **Edit guest list** | Privacy Hidden / Count / Visible as a dropdown **inside Edit guest list** (already a dedicated guest surface). Public/Private stays visibility of the event, not the list. |
| Invite | Edit guest list | Email field + add, matching forms send if it exists; else the same inputs as create-modal guest list. |
| CSV import | Edit guest list | Upload using the same file picker energy as event **image upload**. Preview errors in-modal. |

## Feature 7 — Approval, waitlist, messaging, tickets

| Requirement | Existing control | Overlay |
|---|---|---|
| Approval | Create modal + Participants | Toggle **Require approval** in create/edit. Participants filter chips cloned from Calendar Upcoming/Ended: **Pending**. Talent CTA **Request to join** (same primary button). |
| Waitlist | Same | At capacity, primary CTA label **Join waitlist**. Filter **Waitlist** on Participants. |
| Send message | Participants | **Send message** text button beside Edit guest list; composer modal = confirm-modal layout (title, body, primary Send). |
| Tickets | Create modal | Optional block after category: name, free/price, quantity — same fields as Name/Location. Unpaid Join uses existing Reserve/Join button disabled with helper text. |

## Feature 8 — Join and room

| Requirement | Existing control | Overlay |
|---|---|---|
| Join window | **Enum meet** link on detail | Before start: helper under that link (existing body type). Live: **Join event** occupies the **Reserve a spot** primary slot for Going talents on virtual/hybrid. Ended: Closed badge already exists. |
| Access check | Reserve gating | Same button, server refuses; toast existing error style. |
| Waiting room / in-room | No event-page room today | If Enum Meet UI exists elsewhere, open it from Join **without restyling Events**. If not, room is a full-page that must use Enum shell (same sidebar hidden or same header) — still not a Luma look. Chat/roster use Community chat components if they exist. |

## Feature 9 — Recording and summary

| Requirement | Existing control | Overlay |
|---|---|---|
| Record | Host in-room / Overview | Host control in Meet bar; on Overview a **Notes** block using the same typography as Description. |
| Publish | Overview | Primary/secondary already on detail: **Publish notes** as text button like Copy link. |

## Feature 10 — Community grouping

| Requirement | Existing control | Overlay |
|---|---|---|
| Wizard | Success / confirm modals | End-of-call **modal** identical in structure to Confirm reservation: title, body, Cancel, primary Confirm. Radio/select for one group / per breakout / both — native selects like Category. |
| Target group | Community | Group picker, not a new directory. |

## Feature 11 — Roles, analytics, embed, series, P2

| Requirement | Existing control | Overlay |
|---|---|---|
| Roles | Edit + overflow | People list in Edit guest list / event Edit, role dropdown. |
| Insights | List **stat chips** | Extra chips on the same stats row (views, going, checked in, joins). No charts required for v1. |
| Embed | **Copy link** | Overflow **Copy embed** next to Copy link. |
| Series | **Duplicate** | Duplicate remains the series primitive; optional dates fields on Edit. Recurring P2 = more fields on create modal, not a new series product. |
| Location autocomplete | Location text field | Same field, suggestions underneath (Places). |
| Custom URL | Copy link | Slug field on Edit, still copied via Copy link. |
| Feedback | Ended talent state | After Ended, primary becomes **Leave feedback** using Confirm modal. |

---

# Part D — What you must not do

- Do not restyle talent event pages to look like Luma.
- Do not replace Create event modal with a multi-step wizard.
- Do not add sidebar items (no Insights, Tickets, Meet as new nav).
- Do not rename Calendar vs Events in this build (known inconsistency; overlay around it).
- Do not add a second guest list besides **Edit guest list** / Participants.
- Do not add a second talent “my events” besides Calendar Upcoming/Ended unless you clone those tabs exactly onto Events.
- Do not show a new Join URL in the description if the primary CTA can carry Join.

---

# Part E — Build order on this chrome

1. Talent CTA + success modal + Calendar tabs (F1)  
2. Overflow Cancel/Archive (F4) + Participants export (F3)  
3. Create/Edit extra fields (F3, F6, F7) inside **existing modal**  
4. Edit guest list = privacy, invite, import (F6)  
5. Notifications SMS toggle (F5)  
6. Participants filters + Send message + Check in (F2, F7)  
7. Enum meet link → Join CTA (F8)  
8. Overview notes + end-call modal (F9, F10)  
9. Stat chips + Copy embed + roles in Edit (F11)  

---

# Part F — QA against existing screens only

QA signs off a feature when the **URL and chrome are unchanged** except labels on existing buttons, extra fields in existing forms, extra overflow items, extra filters on existing tab bars, and extra modals that copy Confirm reservation / Create success.

If a screenshot of the page chrome (sidebar, header, tab set) differs from production besides those attachments, the overlay was violated.
