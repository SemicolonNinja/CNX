# Enum Events & Meet
H2 2026 · Build 1

| Field | Value |
|---|---|
| Document | Events & Meet PRD (EFX) |
| Version | v1.1 |
| Pillar | EFX — Events & Facilitation Experience |
| Author | Tunmise (EFX) |
| Status | Ready for sprint |
| Pairs with | Events & Meet Design Backlog — Door, Room & After (v1.0, opened from this PRD) |

## Overview

This build deepens Enum Events and ships Enum Meet. Today an event is reserved by hand from the talent app, must show a Reserved button that cannot be undone, lives as a listing with an optional pasted meeting URL, and can only count people — it cannot ticket them, text them, or put them in a Community group after a call. After this build an organiser can build the door (who may come), run the room (Enum Meet with a paywall), and run the after (notes and Community chats). They can turn guest-list visibility off, send the event to people by email or CSV, edit access without moving the floor under people already Going, grade attendance with a real check-in, schedule Join so the talent sees a countdown or a live button, share a ticket with a QR, and trust that every attempt to Join is checked against the same rule as reserve.

Eleven features ship together. One change sits under all of them: **every access decision is calculated at the door and again at Join, stored on the registration, and never trusted from the client**. Community grouping is calculated from the **Meet roster** (who joined), never from the RSVP list. Call summaries are computed from Enum Meet audio after the recording stops, and never invented on render. Each feature below is written for everyone building it — a user story, the problem, the solution, the objective, the users, the journey with a flow, a full acceptance-criteria table, a table of edge cases with the exact user-facing message, and a note reconciling it against the paired design item.

The same event object serves two strategies. Only the door changes.

| | Public masterclass | Cohort standup |
|---|---|---|
| Door | Discover + free or paid reserve | Invite, CSV, or program membership |
| Guest list | Count only or visible with opt-out | Hidden |
| Room | Enum Meet | Enum Meet |
| After | Optional Community group | Add joiners to the cohort group |
| Breakouts | Host chooses one group vs per-breakout | Usually one group per breakout |

Parked Luma items are **out of this build** and must not be pulled in: hide location until registered; Apple/Google Wallet passes; WhatsApp; coupons, unlock codes, group purchase, tax, invoices, refunds; logged-out marketing pages and Open Graph previews; follow-host; featured Discover; API/Zapier; AI event descriptions; crypto/token-gating.

## How to read a feature

**UI:** Implement against the extracted Events experience. Do not restyle pages, do not add sidebar items, do not replace the create modal or talent event layout. New fields go in existing forms; new actions go in existing overflow, CTA, or tab chrome. Full map: Events UI overlay v1.0.

Each acceptance-criteria table uses the same rows so QA can review every feature the same way: Access & entry point; Talent experience; Core functionality; Validation rules; State management; UI states (Loading / Empty / Success / Failure, plus Locked, Live, or Awaiting where they apply); UI requirements; Backend behaviour; Interactions & compatibility (backward, forward, and cross-module); Permissions; Edge cases; Analytics events; Audit trail; Dependencies; Success criteria. Where a row does not apply, it says so rather than being dropped, so a reviewer can tell the difference between ‘not applicable’ and ‘missed’.

## Terms used in this document

| Term | Plain meaning |
|---|---|
| Event | A scheduled gathering with a door (who may come) and, for virtual or hybrid, a room (Enum Meet). |
| Door | The access rule: reserved, invited, member, approved, waitlisted, or paid. |
| Room | The live Enum Meet session for people who passed the door. |
| After | What happens when the room closes: recording, summary, Community groups. |
| Administration | One running of an event for a defined set of people. The same event can be given more than once (a series). |
| Talent | The person attending, on `talent.*`. |
| Educator / organiser | The person creating and running the event, on `educator.*`. |
| Going | The talent is confirmed for the event (reserved, invited-and-accepted, or paid). |
| Ticket | The talent-facing proof of Going: name, event, status, unique QR. |
| Join window | The time the room can be entered: optional early entry, live, then ended. |
| Roster | The Enum identities who actually joined the room, with join/leave times. |
| Breakout | A temporary sub-room during a call, with its own roster and in-call chat. |
| Community group | A chat group under Community, which can outlive the event. |
| Guest-list privacy | Whether other talents can see who is Going: hidden, count only, or visible (with opt-out). |
| Outcome of grouping | Host choice after a call: one group for everyone, one group per breakout, or both — and whether in-call chats are imported. |

## Who this speaks to

| Collaborator | What they own in this build |
|---|---|
| Backend squad | Access checks at reserve and Join; tickets and check-in; invites and CSV import; SMS send; approval/waitlist; basic payments at Join; Meet signalling, roster, recording; summary pipeline (WhisperX / faster-whisper + structured LLM); Community group writes from roster and breakouts. |
| Frontend squad | Talent Events tabs, cancel, calendar export, ticket; educator settings, guest list, invites, messaging; Meet Join states, room chrome, breakout UI, post-call grouping wizard. |
| Design | Every empty, loading, and error state named here; Join countdown vs live; guest-list privacy picker; post-call grouping choices; summary review before publish. |
| QA | Concurrent capacity; Join with cancelled/unpaid access; QR check-in; SMS consent; breakout grouping combinations; summary owners limited to roster. |
| Community (chats) | Group create/add APIs that Events/Meet call. Events must not invent a second chat system. |
| Chioma (NDPA) | SMS consent and retention; recording and transcript access; who may see a published summary. |
| Samuel (IRX) | One Talent identity so an invited email and a later Enum account are the same person. |
| Elom (WHX) & LTX | They may send people into an event the same way they send an assessment — reuse invites/distribution, do not fork it. |

## How the features interact

These eleven features are not independent. Access, the room, and Community grouping run through several of them. This map is here so a reviewer can see the seams before reading each feature in isolation.

| This feature… | …depends on | …is depended on by |
|---|---|---|
| 1 Talent reservation loop | Existing reserve + calendar | 2 ticket; 4 communications; 8 Join |
| 2 Tickets and check-in | 1 Going status | 8 Join (same ticket identity); 7 door staff role |
| 3 Registration controls | Existing event + participant list | 5 invites; 6 approval/waitlist; 7 tickets |
| 4 Organiser lifecycle | Existing create/edit | 3 capacity edits; 8 closing the room |
| 5 Communications (email + SMS) | 1, 3 statuses; IRX identity | 6 decisions; 8 Join reminders |
| 6 Guest-list privacy, invites, CSV import | 3 statuses; IRX | 7 approval auto-approve invited; 8 door |
| 7 Approval, waitlist, messaging, basic tickets | 3, 6 | 8 paywall at Join |
| 8 Enum Meet Join and room | 1–7 access | 9 recording, roster, chat; 10 grouping |
| 9 Recording and call summary | 8 roster + recording | 10 group attach of notes |
| 10 After-call Community grouping | 8 roster, breakouts, chats | — |
| 11 Roles, analytics, embeds, series | 1–8 | Recurring occurrences reuse 8–10 |

The one chain to hold in mind: a person becomes Going at the door (1, 3, 6, 7), presents a ticket or Join (2, 8), appears on the roster, and only then can be added to a Community group (10) or named as an action-item owner (9). Build order follows that chain — see ‘Order of work’ at the end.

---

# Feature 1 — Talent reservation loop

As a talent, I want to manage a reservation the way I would on any event product — cancel it, put it on my real calendar, and find it under Going rather than mixed into Discover — so that reserving is not a trap.

**Business problem:** Talent can already Reserve a spot. After that the button dies as Reserved. Success copy says the event was added to “your calendar” but only Enum’s calendar is meant. Discover mixes catalog events with enrolled ones. Dashboard times have disagreed with the event page. People who reserved cannot recover, cannot live in Google Calendar, and cannot tell “events I can join” from “events I am going to.”

**Solution:** Keep the existing reserve flow. Add Cancel reservation, `.ics` and add-to-calendar actions, Discover / Going / Past, timezone on every time, and honest calendar copy. Do not rebuild self-registration.

**Product objective:** Close the talent loop so a reservation is reversible, portable to a personal calendar via a `.ics` web link, and findable.

**Target users:** Talent; organisers who receive cancel notifications.

**Cancel:** Event page or calendar → You're going → Cancel reservation → Confirm → Reserved spot released → Reserve a spot returns

**Calendar:** Success or ticket → Add to Google / Apple / Outlook or Download .ics

**Find:** Events → Discover | Going | Past

### Acceptance criteria

| Category | Specification |
|---|---|
| Access & entry point | User types: Talent signed in. Entry: event detail, calendar popover, Events tabs. Organiser is not required for cancel. |
| Talent experience | • Cancel is visible wherever Going is shown. • Success never claims a third-party calendar unless an `.ics` or provider button was used. • Discover is events they can join; Going is confirmed upcoming/ongoing; Past is ended ones they reserved. • Every datetime shows a timezone abbreviation. |
| Core functionality | - Cancel sets status Cancelled, frees capacity, notifies organiser. - `.ics` includes DTSTART/DTEND with TZID, location or Join URL only if still eligible, UID stable per registration. - Dashboard, list, detail, and calendar render the same start/end. |
| Validation rules | - Cancel blocked on ended events with an explanation. - Duplicate cancel is a no-op. - Join URL omitted from `.ics` if not Going. |
| State management | Going → Cancelled. Discover/Going/Past derive from status + start/end, not from a separate flag that can drift. |
| UI states | Loading: cancel in flight. Empty: Going with zero events — “You’re not going to any upcoming events” + Discover CTA. Success: toast + Reserve returns. Failure: ended/private cancel with recovery copy. |
| UI requirements | Disabled Reserved is replaced by You’re going + Cancel. Calendar buttons sit on success and remain on the event page after. |
| Backend behaviour | Cancel is server-authoritative. `.ics` generated server-side. Times stored in UTC, displayed in event TZ and labelled. |
| Interactions & compatibility | Backward: existing Reserved people become Going without re-reserve. Forward: waitlist promotion (Feature 7) hooks cancel. Cross-module: Meet Join (Feature 8) closes for Cancelled. |
| Permissions | Talent cancels only their own registration. |
| Edge cases | Concurrent cancel vs check-in: if already checked in, confirm “You’re marked as arrived. Cancel anyway?” |
| Analytics events | `event_reservation_cancelled`, `event_calendar_downloaded {provider}`, `events_tab_viewed {tab}`. |
| Audit trail | Cancel logged with talent, event, time. |
| Dependencies | Existing reserve. Capacity (Feature 3) for release. |
| Success criteria | A talent can reserve, add a real calendar file, find the event under Going, cancel, and reserve again, with times that never disagree. |

### Edge cases and error messages

| Scenario | What the system does | Message shown to the user |
|---|---|---|
| Talent cancels an upcoming reservation | Releases spot; notifies organiser | “Your reservation has been cancelled.” |
| Talent tries to cancel an ended event | Blocks | “This event has ended, so the reservation can’t be cancelled.” |
| Double tap cancel | One cancel | (No second toast.) |
| `.ics` requested after cancel | Refuses file | “This reservation is no longer active.” |
| Dashboard showed a different time than detail | Treat as a defect; all surfaces read one canonical UTC | (Fix, not a talent message.) |
| Going tab empty | Empty state with Discover | “You’re not going to any upcoming events. Discover events.” |

### The live-sync process

A reservation is not a one-shot file download. Talent can subscribe to a host calendar that stays current.

1. **The web link.** The event host exposes a unique URL ending in `.ics` (often `webcal://` instead of `https://`).
2. **The server hook.** When the talent subscribes, their calendar app stores that exact address.
3. **The background fetch.** The calendar app fetches the latest data at intervals.
4. **The live update.** If the organiser changes date, location, or description, the server file updates and the next fetch shows the change.

A talent can hold multiple web links and can stop the sync by unsubscribing from that creator’s calendar updates.

**Design backlog alignment.** New item 1. Owns: You’re going / Cancel, calendar button row, Discover/Going/Past, timezone on timestamps, empty Going. Aligns with full-requirements E1, E2, E4, E5 timezone.

---

# Feature 2 — Tickets, QR and check-in

As a talent going to a physical or hybrid event, I want a ticket I can show, and as a host I want to scan or search people in, so that arrival is not a paper list.

**Business problem:** After reserve there is no artefact. Door staff cannot prove Going. Attendance is not a first-class status.

**Solution:** Every Going registration gets a unique ticket with QR. Hosts and check-in staff scan or search. Statuses: Checked in, already checked in, cancelled, wrong event. Reverse check-in is audited.

**Product objective:** Make attendance operational for in-person and hybrid events.

**Target users:** Talent; hosts; check-in staff (Feature 11).

**Talent:** Going → View ticket → QR + details

**Door:** Check in → Scan or search → Success / already / invalid

### Acceptance criteria

| Category | Specification |
|---|---|
| Access & entry point | Talent: View ticket on event page, Going, calendar. Staff: Check in on the educator event. |
| Talent experience | Ticket shows name, event, date, status, QR. Cancelled ticket clearly void. |
| Core functionality | Unique non-guessable code per registration. Scan or name/email search. Reverse check-in with reason. Counts: Going, checked in, no-show after end. |
| Validation rules | Wrong-event QR rejected. Cancelled cannot check in. Duplicate scan is already-checked-in, not a second attendance. |
| State management | Going → Checked in. Reverse → Going (or a reversed audit, still Going). After event end without check-in → No-show for reporting, not a talent-facing punishment. |
| UI states | Loading: camera permission. Empty: no matches. Success: name flash. Failure: invalid, cancelled, wrong event. Locked: event cancelled. |
| UI requirements | Check-in is usable on a phone in landscape or portrait. Manual search always available if camera fails. |
| Backend behaviour | Code is unguessable. Check-in is idempotent. Staff identity stored on each scan. |
| Interactions & compatibility | Backward: existing Going people get a ticket without re-reserve. Forward: Join (Feature 8) can show the same ticket identity. Cross-module: Feature 11 check-in role. |
| Permissions | Talent sees only own ticket. Staff see roster for that event only. |
| Edge cases | Offline: out of scope this build; show “Connect to check in.” |
| Analytics events | `ticket_viewed`, `checkin_succeeded`, `checkin_rejected {reason}`, `checkin_reversed`. |
| Audit trail | Every scan and reverse with actor, time, result. |
| Dependencies | Feature 1 Going/Cancelled. Feature 11 roles. |
| Success criteria | Door staff can check a line in without a spreadsheet; duplicates do not double-count. |

### Edge cases and error messages

| Scenario | What the system does | Message shown to the user |
|---|---|---|
| Valid QR | Marks checked in | “Checked in — [name].” |
| Already checked in | No duplicate | “Already checked in at [time].” |
| Cancelled ticket | Rejects | “This ticket was cancelled.” |
| Wrong event | Rejects | “This ticket is for a different event.” |
| Camera denied | Falls back to search | “Allow camera, or search by name.” |
| Reverse check-in | Requires confirm | “Remove check-in for [name]?” |

**Design backlog alignment.** New item 2. Owns: ticket layout, scanner, search, success flash.

---

# Feature 3 — Registration controls: capacity, questions, statuses, CSV export

As an organiser, I want to cap attendance, ask extra questions, see real statuses, and export a list, so that a public event does not overbook and I can operate from data.

**Business problem:** Reserve has no visible capacity, no custom questions, and a count that does not say invited vs going vs cancelled.

**Solution:** Registration settings: open/closed/opens-on, optional capacity, remaining-spot copy, custom questions, statuses (Invited, Registered/Going, Pending, Waitlisted, Cancelled, Checked in, No-show), search/filter, Export CSV.

**Product objective:** Make the guest list the operational record of the event.

**Target users:** Organisers and managers.

**Settings:** Event → Registration → capacity, window, questions → Save

**List:** Participants → filter → Export CSV

### Acceptance criteria

| Category | Specification |
|---|---|
| Access & entry point | Educator event: Registration section and Participants tab. Same roles as event edit. |
| Talent experience | Public page shows Reserve / opens on / X spots left / full / closed / ended / You’re going. Questions appear on reserve. Required questions block submit. |
| Core functionality | Capacity optional, default unlimited. Concurrent reserves cannot exceed cap. Questions: short, long, single, multiple, acknowledgement; required; reorder. CSV: identity, status, timestamps, source, answers. Formula injection neutralised. |
| Validation rules | Lowering capacity below current Going requires confirm; does not remove people. Closed events reject new Going. |
| State management | Status is the source of truth for Discover CTA and Join. |
| UI states | Empty participants: “No one yet — invite or share the link.” Loading export. Failure: export permission. |
| UI requirements | Remaining spots optional display. Question builder in Registration, not a separate app. |
| Backend behaviour | Capacity enforced in a transaction. Export scoped to org. |
| Interactions & compatibility | Backward: existing events unlimited, no questions. Forward: Feature 7 waitlist at cap. Cross-module: Feature 6 import fills Invited/Going. |
| Permissions | Export is audited; sensitive answers only owner/manager. |
| Edge cases | Two last spots, two submits: one Going, one waitlist once Feature 7 exists; until then the second gets “This event just filled.” |
| Analytics events | `registration_settings_saved`, `participant_csv_exported`, `reserve_blocked {reason: full\|closed}`. |
| Audit trail | Export and capacity changes logged. |
| Dependencies | Feature 1 cancel releases cap. |
| Success criteria | Overbook is impossible; the CSV matches the on-screen list. |

### Edge cases and error messages

| Scenario | What the system does | Message shown to the user |
|---|---|---|
| Event full | Blocks reserve | “This event is full.” |
| Registration closed | Blocks | “Registration is closed.” |
| Opens later | Blocks start | “Registration opens on [time].” |
| Required question blank | Blocks | “Answer the required questions to reserve.” |
| Lower cap below Going | Confirm only | “There are already [n] going. They will keep their spots.” |
| Export with no permission | Blocks | “You don’t have permission to export this list.” |

**Design backlog alignment.** New item 3. Owns: remaining spots, question builder, status filters, empty list.

---

# Feature 4 — Organiser cancel, archive and delete

As an organiser, I want cancel, archive, and delete to be three different actions with a next step when one is blocked, so that I am never told “only cancelled events can be deleted” with no way to cancel.

**Business problem:** Delete failed on an ended event because it was not cancelled, and cancel was not offered. Test and dead events stuck.

**Solution:** Cancel event (notify Going, close Join). Archive (hide from default lists). Delete (strict if participants exist). Errors name the next action.

**Product objective:** Recoverable event lifecycle.

**Target users:** Owner and org admin.

**Flow:** Event ⋯ → Cancel / Archive / Delete → Confirm impact → Done

### Acceptance criteria

| Category | Specification |
|---|---|
| Access & entry point | Educator event overflow, same as today’s Delete. |
| Talent experience | On cancel: email/SMS (Feature 5), Join closed, ticket void. Archived events disappear from Discover; Going people still see Past/cancelled copy. |
| Core functionality | Cancel any future event. Archive ended or cancelled. Delete only when policy allows (no Going, or already cancelled and confirmed). |
| Validation rules | Cannot delete Going event until cancelled. Past start: cancel still allowed if not ended; ended → archive. |
| State management | Scheduled → Cancelled → (optional) Deleted. Ended → Archived. |
| UI states | Confirm lists recipient count. Failure: “Cancel this event first.” with button. |
| UI requirements | Three labels, never one Delete for all. |
| Backend behaviour | Cancel is idempotent. Notifications queued, not best-effort only. |
| Interactions & compatibility | Backward: existing Closed/Ended map to Ended. Forward: Feature 8 ends the room. Cross-module: Feature 10 grouping still available on ended until dismissed. |
| Permissions | Owner/admin. |
| Edge cases | Cancel while people are Live in Meet: end room, then notify. |
| Analytics events | `event_cancelled`, `event_archived`, `event_deleted`. |
| Audit trail | Actor, from-status, to-status, time. |
| Dependencies | Feature 5 notifications. Feature 8 room end. |
| Success criteria | No lifecycle dead end. |

### Edge cases and error messages

| Scenario | What the system does | Message shown to the user |
|---|---|---|
| Delete while not cancelled | Blocks with next action | “This event must be cancelled before it can be deleted. Cancel event.” |
| Cancel upcoming | Notifies Going | “Event cancelled. [n] people will be notified.” |
| Archive ended | Hides from default list | “Event archived.” |
| Delete with Going and not cancelled | Same as first | “This event must be cancelled before it can be deleted. Cancel event.” |

**Design backlog alignment.** New item 4. Owns: three actions, impact confirm, recovery error.

---

# Feature 5 — Confirmations, reminders, email and SMS

As an organiser, I want the same lifecycle messages on email and SMS (where the talent opted in), so that people actually show up.

**Business problem:** In-app success exists. Reminder delivery is not a visible part of the journey. SMS was requested for this build; WhatsApp is parked.

**Solution:** Transactional templates: reserved, invited, approved/declined, reminder (24h and 1h defaults), updated, cancelled, waitlist promoted. Channels: in-app, email, SMS. SMS only with consent in notification settings.

**Product objective:** One message matrix, two channels, consent-respecting SMS.

**Target users:** Talent; organisers watching delivery failures.

**Flow:** Lifecycle event → render template → send allowed channels → record delivery

### Acceptance criteria

| Category | Specification |
|---|---|
| Access & entry point | Automatic on lifecycle. Organiser previews reminders in event settings. Talent: Settings → notifications → Events (in-app, email, SMS). |
| Talent experience | Email includes time with TZ, place or Join, cancel link. SMS is short: name, time, Join or venue. No raw Join URL in SMS unless already Going. |
| Core functionality | Defaults 24h and 1h. Preview send time. Failed email/SMS visible on participant or blast. |
| Validation rules | No SMS without opt-in. Invalid numbers skipped, email still goes. |
| State management | Each send: queued → sent → failed / unsubscribed. |
| UI states | Empty: no phone on file — skip SMS silently for that channel. Failure: listed for organiser. |
| UI requirements | Settings copy: “Event invitations, reminders, and changes” includes SMS toggle. |
| Backend behaviour | Server-side consent check. Chioma signs SMS retention and sender ID. |
| Interactions & compatibility | Backward: existing in-app Events toggle remains. Forward: Feature 7 approval emails. Cross-module: Feature 8 Join time in reminder. |
| Permissions | Talent only their settings. |
| Edge cases | Number fails: email still sent. |
| Analytics events | `event_message_sent {channel, template}`, `event_message_failed {channel}`. |
| Audit trail | Template, channel, recipient, result, time. |
| Dependencies | Feature 1–4 statuses. IRX identity. NDPA sign-off for SMS. |
| Success criteria | Reminders exist as products, not only a create-form dropdown. |

### Edge cases and error messages

| Scenario | What the system does | Message shown to the user |
|---|---|---|
| SMS opted out | Email/in-app only | (No SMS.) |
| SMS failed | Marks failed | Organiser: “SMS to [name] failed. Email was sent.” |
| Event time changes | Sends updated | “This event was updated. New time: [time TZ].” |
| Event cancelled | Sends cancelled | “This event has been cancelled.” |

**Design backlog alignment.** New item 5. Owns: preview, SMS toggle, organiser failed-delivery list. **NDPA flagged** for SMS.

---

# Feature 6 — Guest-list privacy, invites and CSV import

As an organiser, I want to hide or show who is going, invite people by email, and import a spreadsheet, so that I can fill a room without putting everyone on a public list.

**Business problem:** Luma-class ops. Enum had no invite/import path observed and no guest-list privacy.

**Solution:** Privacy: Hidden (default for private/cohort) / Count only / Visible to guests with per-talent opt-out. Invites: paste emails, optional message, Invited until accept. CSV: name, email, optional role; validate; skip duplicates; host chooses Invited or Going. Invited people auto-approve if approval is on (Feature 7).

**Product objective:** Hosts can pull a known list in, without leaking emails on the event page.

**Target users:** Organisers; invited talent.

**Privacy:** Settings → Guest list → Hidden | Count | Visible

**Invite:** Guests → Invite → emails → Send

**Import:** Guests → Import CSV → preview errors → Import

### Acceptance criteria

| Category | Specification |
|---|---|
| Access & entry point | Educator guests/settings. Talent: opt-out if Visible. |
| Talent experience | Hidden: no names. Count only: “24 going.” Visible: names/avatars, never emails; opt-out. Invite email lands on the event with Accept. |
| Core functionality | Invite creates Invited. CSV preview with row errors; good rows import. Duplicate email skipped with report. |
| Validation rules | Invalid emails rejected, valid kept. Empty CSV blocked. Emails never on public list. |
| State management | Invited → Going on accept/reserve. Import does not duplicate Feature 3 session keys; duplicates by email. |
| UI states | Loading import. Empty invite list prompt. Partial success with row list. |
| UI requirements | Privacy picker in plain language. Import template downloadable. |
| Backend behaviour | Invites and imports server-side. IRX reconciles email to identity later. |
| Interactions & compatibility | Backward: current public pages show no guest list (treat as Hidden). Forward: Feature 7 auto-approve invited. Cross-module: Feature 8 Join for Invited who accepted. |
| Permissions | Owner/manager. |
| Edge cases | Import 500 rows: async with progress; do not timeout the tab. |
| Analytics events | `guest_privacy_set {mode}`, `event_invite_sent {count}`, `event_csv_imported {ok, failed}`. |
| Audit trail | Import file meta, actor, counts. Invite send log. |
| Dependencies | Feature 3 statuses. Feature 5 invite email. IRX. |
| Success criteria | A cohort can be loaded from CSV without appearing on a public page. |

### Edge cases and error messages

| Scenario | What the system does | Message shown to the user |
|---|---|---|
| Invalid email in invite | Drops that row | “[address] is not a valid email and was not added.” |
| Duplicate in CSV | Skips | “[n] rows skipped — already on the list.” |
| Empty file | Blocks | “No rows to import. Download the template and try again.” |
| Visible list, talent opts out | Removed from public list, still Going | “You won’t appear on the guest list.” |
| Someone without access opens invite link | Sign-in/accept gate | “Sign in to accept this invitation.” |

**Design backlog alignment.** New item 6. Owns: privacy picker, invite panel, CSV preview, public count vs names.

---

# Feature 7 — Approval, waitlist, guest messaging and basic tickets

As an organiser, I want to vet people, queue overflow, message segments, and charge a simple ticket whose paywall is checked again at Join, so that demand and money work without a full commerce suite.

**Business problem:** Reserve is immediate. Full events dead-end. No host message tool. No paid Join.

**Solution:** Require approval → Pending. Waitlist at capacity. Message registered/pending/waitlisted/checked-in/no-shows/invited. Ticket types: name, free or price, quantity, window, per-person cap. **Paywall at Join** as well as at reserve. Coupons, tax, refunds, group checkout are out of scope.

**Product objective:** Serious event operations without Luma’s full commerce.

**Target users:** Organisers; talent requesting, waitlisted, or paying.

**Approval:** Settings on → talent Requested → host Approve/Decline

**Waitlist:** At cap → Join waitlist → host Promote

**Message:** Participants → Send message → segment → preview count → send

**Ticket:** Settings → ticket type → talent pays → Going → Join re-checks paid

### Acceptance criteria

| Category | Specification |
|---|---|
| Access & entry point | Registration settings; Participants Pending/Waitlist; Send message; ticket types on settings. |
| Talent experience | Requested until decision. Waitlisted vs Going vs Requested are distinct. Paid: cannot Join if unpaid/cancelled. |
| Core functionality | Capacity consumed on approval, not on request. Waitlist order FIFO unless host reorders. Promote optional deadline. Message preview count. Tickets basic fields only. |
| Validation rules | Decline optional note. Message with 0 recipients blocked. |
| State management | Pending / Waitlisted / Going / Cancelled. Payment eligible flag on Going. |
| UI states | Empty Pending. Awaiting payment. Failure: payment incomplete at Join. |
| UI requirements | Segment picker names counts. |
| Backend behaviour | Approval and payment re-checked on Join (Feature 8). |
| Interactions & compatibility | Backward: open events unchanged. Forward: Feature 8 waiting room. Cross-module: Feature 5 decision messages. Out of scope: coupons, unlock codes, group purchase, tax, invoices, refunds. |
| Permissions | Host/manager approve and message. |
| Edge cases | Promote when event already started: allowed, Join if still live. |
| Analytics events | `registration_approved`, `waitlist_joined`, `waitlist_promoted`, `event_message_blasted {segment, n}`, `ticket_purchased`. |
| Audit trail | Decisions, promotions, blasts, payments (provider id). |
| Dependencies | Features 3, 5, 6, 8. |
| Success criteria | A host can run a gated or paid session without overbook or unpaid Join. |

### Edge cases and error messages

| Scenario | What the system does | Message shown to the user |
|---|---|---|
| Approval required | Status Requested | “Your request was sent. You’ll hear when the host decides.” |
| Declined | Not Going | “Your request was not approved.” |
| Event full | Waitlist CTA | “This event is full. Join the waitlist.” |
| Unpaid at Join | Blocks room | “Payment is incomplete, so you can’t join yet.” |
| Message with nobody | Blocks | “This segment is empty.” |

**Design backlog alignment.** New item 7. Owns: Requested state, waitlist, blast composer, ticket types, unpaid Join.

---

# Feature 8 — Enum Meet: time-aware Join and the live room

As a talent who is Going, I want a Join button that opens at the right time into a real room, and as a host I want Meet-like controls, so that the event is not a pasted URL in the description.

**Business problem:** Hybrid/virtual events showed “Enum meet” without countdown, live, or ended. Access was not re-checked. This build’s product is Google Meet with Enum’s door on it.

**Solution:** Join window; access check (Going, not cancelled, paid if required, membership if required); waiting room; camera/mic/share; host mute/remove/lock/end; main-room chat persisted for Feature 10; roster of Enum identities.

**Product objective:** Own the room. Same object for public masterclass and cohort standup.

**Target users:** Talent Going; hosts.

The Join button has three times, like Off / Basic / Strict on assessments — the talent always knows which one they are in.

| Time | What the talent sees | What the system does |
|---|---|---|
| Before the window | Start time + timezone; Join disabled or “Opens at start” | Access is not granted. A pasted room URL does not work. |
| Live | Primary **Join event** | Re-checks Going, payment, approval. Optional waiting room. Roster join recorded. |
| Ended | **Event ended** | Join disabled. Grouping (Feature 10) can start. |

**Before:** countdown / Opens at start

**Live:** Join event → waiting room optional → room

**After:** Event ended

### Acceptance criteria

| Category | Specification |
|---|---|
| Access & entry point | Event page, reminder, calendar, ticket. Host: Start room from educator event. |
| Talent experience | Unregistered never see a working room URL. Missing room: “Host has not opened the room.” Ended: Join disabled. |
| Core functionality | Early-entry policy optional. Waiting room. A/V + screen share. Device permission errors recoverable. Host: mute, remove, lock, end. Chat in main room, persisted. Roster join/leave timestamps. |
| Validation rules | Cancelled, pending, waitlisted, unpaid cannot Join. Strict: server check every Join press. |
| State management | Not open → Live → Ended. Roster append-only. |
| UI states | Loading media. Empty waiting room. Live. Failure: permissions, kicked, event ended. Locked: cancelled event. |
| UI requirements | Join is the primary CTA during the window, not a link in the body. Honest “checks active” is N/A (not proctoring). |
| Backend behaviour | Signalling/media Enum-hosted. Chat and roster stored for grouping. |
| Interactions & compatibility | Backward: pasted third-party URLs still allowed as fallback if host pastes one and does not use Enum Meet. Forward: Feature 9 recording from this SFU. Cross-module: all door features. |
| Permissions | Host controls; talent cannot unmute others. |
| Edge cases | Mid-call revoke access: kick and update roster. |
| Analytics events | `meet_join_clicked`, `meet_join_denied {reason}`, `meet_room_started`, `meet_room_ended`. |
| Audit trail | Joins, kicks, lock, end. |
| Dependencies | Features 1–7 access. Community not required to Join. |
| Success criteria | A Going talent taps Join when live and is in the room; a cancelled talent cannot. |

### Edge cases and error messages

| Scenario | What the system does | Message shown to the user |
|---|---|---|
| Too early | Disabled Join | “This session opens at [time TZ].” |
| Live | Primary Join | “Join event.” |
| Ended | Disabled | “This event has ended.” |
| Not Going | Blocks | “Reserve a spot to join.” |
| Cancelled | Blocks | “This reservation was cancelled.” |
| Host not started | Blocks | “The host hasn’t opened the room yet.” |
| Mic denied | Recover | “Allow microphone to be heard, or join muted.” |
| Kicked | Removed | “You’ve been removed from this session.” |

**Design backlog alignment.** New item 8. Owns: countdown, Join, waiting room, in-room chrome, chat, host bar.

---

# Feature 9 — Recording, summary, key details and action items

As a host, I want a recording and a structured summary of the call — what was said, key details, and action items — so that the room produces a record, not only a memory.

**Business problem:** Meet without notes is a hole. Hosted Otter-class tools are not the architecture. Enum owns the audio.

**Solution:** Host starts/stops recording (visible indicator). Access = same as Join. Pipeline: recording → faster-whisper or WhisperX → map speakers to **roster** (pyannote only to fill gaps; HF gated token required) → LLM JSON `{summary, key_details[], decisions[], action_items[{task, owner_user_id?, due, confidence, quote}]}`. Host edits, then publishes to attendees and/or the Community group. Default: not published until host confirms. Breakout recordings can yield per-breakout notes when Feature 10 creates per-breakout groups.

The pipeline is one chain. Do not skip a stage or substitute a desktop note-taker.

| Stage | Use | Why |
|---|---|---|
| Capture | Enum Meet recording (server mix) plus roster timestamps | Roster IDs beat “Speaker 2” for owners and group adds |
| Speech-to-text | faster-whisper or WhisperX | Self-hosted ASR with timestamps |
| Who spoke | Map to Meet roster first; pyannote only for gaps (Hugging Face gated token) | Action owners must be Enum users |
| Structure | LLM JSON: `summary`, `key_details[]`, `decisions[]`, `action_items[{task, owner_user_id?, due, confidence, quote}]` | The UI is a form, not a blob of prose |
| Guardrails | Schema validation; owners not on the roster become Unassigned | Stops hallucinated assignees |

**Do not ship as the product:** Meetily (desktop); Vexa (bot into Google Meet/Zoom — only if a later build still uses an external room); Otter / Fireflies. Treat MIA / Minutes as prompt and UX references only.

**Product objective:** Self-hosted notes whose owners are Enum users who were on the call.

**Target users:** Hosts; attendees after publish; Chioma on retention.

**Flow:** Record → process → host review → Publish to attendees / group / both

### Acceptance criteria

| Category | Specification |
|---|---|
| Access & entry point | Host: Record in Meet; Summary on ended event. Talent: only after publish. |
| Talent experience | No live transcript required this build. Published note is read-only for attendees. |
| Core functionality | Indicator while recording. Pipeline from Enum audio, no manual upload for the happy path. Owners only from roster or Unassigned. Schema validation; no invented people. Failure: “Summary unavailable” + retry. |
| Validation rules | Cannot publish empty schema. Action owner not on roster → Unassigned. |
| State management | Recording: off/on/processing/ready/failed. Summary: draft/published. |
| UI states | Loading processing. Empty: host skipped record. Success: draft. Failure: retry. |
| UI requirements | Edit fields before publish. Low-confidence actions flagged. |
| Backend behaviour | Same ACL as recording. NDPA: who can download transcript. |
| Interactions & compatibility | Backward: events without Meet skip this. Forward: Feature 10 attach note to group. Cross-module: Feature 8 roster. |
| Permissions | Host publish. Talent read published only. |
| Edge cases | No speech: summary says no speech detected, not a fake essay. |
| Analytics events | `meet_recording_started`, `meet_summary_ready`, `meet_summary_published`. |
| Audit trail | Publish actor, audience, time. |
| Dependencies | Feature 8. GPU/worker for Whisper. HF token if pyannote used. LLM endpoint. |
| Success criteria | A published note has summary, key details, and action items; assignees were on the roster. |

### Edge cases and error messages

| Scenario | What the system does | Message shown to the user |
|---|---|---|
| Processing | Wait | “Preparing the summary of this session…” |
| ASR/LLM fail | Retry | “Summary unavailable. Retry.” |
| No recording | Empty | “This session wasn’t recorded, so there’s no summary.” |
| Owner not on roster | Unassigned | (Host sees Unassigned, not a fake name.) |
| Talent opens before publish | Hide | “The host hasn’t shared notes from this session yet.” |

**Design backlog alignment.** New item 9. Owns: record indicator, draft editor, publish targets. **NDPA flagged.**

---

# Feature 10 — After the call: Community groups and breakout grouping

As a host, I want to add the people who were actually on the call to a Community chat group, and if we used breakouts I want to choose whether each breakout becomes its own group or everyone lands in one group — including what happens to in-call chats.

**Business problem:** The strategy is Meet + paywall + messages + groups. Without this, the room dies when Join ends.

**Solution:** Prompt near end or on ended event. Eligibility: **roster** (joined), not merely Going. Options: existing group / new group / skip. If breakouts ran, a required grouping step:

If the call used breakouts, the host must pick **one** membership model and **one** chat policy before confirm.

| Choice | Members | Chats |
|---|---|---|
| **One group for everyone** | All main-room joiners in a single Community group | Main-room chat can be the opening thread. Breakout chats are attached as threads or files, or dropped — host picks in the chat policy. |
| **One group per breakout** | Each breakout roster becomes its own Community group | That breakout’s in-call chat becomes that group’s starting history. Main-room chat: copy into all groups, into none, or into a separate plenary group. |
| **Both** | Plenary group **and** per-breakout groups | Main chat → plenary. Each breakout chat → its group. People who were in a breakout land in both. |

Chat policy (always, including when there were no breakouts):

- **Include in-call chats** in the Community group(s)
- **Admin only** — members cannot create groups from calls; only admins can
- **Breakout chats** — keep members, drop those transcripts

Empty breakouts create no group. A person who sat in two breakouts is added to each corresponding group if “per breakout” is on. Hosts are added to every created group. Names default to `{Event name} — {Breakout name}` and are editable before confirm. The step can be deferred; it stays on the ended event until dismissed.

**Multi-breakout person:** prompt the admin for each group if “per breakout” is on. If **No** → create one group whose chat history is shown only to members of the previous breakout groups. If **Yes** → create multiple chats with chat history shown to everybody.

**Product objective:** The call continues as Community chats the host designed.

**Target users:** Hosts; Community members added.

**Flow:** End call / Ended event → Grouping wizard → Confirm names → Groups created → Members added

### Acceptance criteria

| Category | Specification |
|---|---|
| Access & entry point | Host modal at end; persist on ended event until dismissed. |
| Talent experience | They appear in Community chats they were added to. They are not added if they only reserved and never joined. |
| Core functionality | Empty breakout → no group. Multi-breakout person → prompt admin for each group if per-breakout (No = one group with history limited to those breakout members; Yes = multiple chats, history for everybody). Hosts added to every created group. Default names `{Event} — {Breakout}`, editable before confirm. |
| Validation rules | Cannot add Cancelled-only people. Need Community permission to add to an existing group. |
| State management | Dismiss remembers “skipped.” Reopen until dismissed. |
| UI states | Loading add. Empty roster: “No one joined, so there’s no one to add.” Success: links to groups. Failure: Community API error with retry. |
| UI requirements | Membership choice and chat-history choice are separate, both required if breakouts exist. |
| Backend behaviour | Uses Community group APIs. Chat import is a transcript post or thread, not a second messenger. |
| Interactions & compatibility | Backward: no breakouts → only Feature 26 one-group flow. Forward: summary (Feature 9) can attach after. Cross-module: Community. |
| Permissions | Host/moderator. |
| Edge cases | Both + include chats: plenary gets main chat; each breakout group gets that breakout chat; people in a breakout are in both groups. |
| Analytics events | `meet_grouping_completed {mode, chat_policy, groups_created}`. |
| Audit trail | Who added whom to which group. |
| Dependencies | Feature 8 roster, breakouts, chats. Community. |
| Success criteria | Host can produce one group or N breakout groups with a conscious chat-import choice. |

### Edge cases and error messages

| Scenario | What the system does | Message shown to the user |
|---|---|---|
| Nobody joined | No groups | “No one joined this session, so there’s no one to add to a group.” |
| Empty breakout | Skip that room | (Listed as skipped in confirm.) |
| No permission on existing group | Blocks that target | “You can’t add people to [group]. Choose another group or create a new one.” |
| Community write fails | Retry | “We couldn’t create the group. Try again.” |
| Talent reserved but never joined | Not added | (Host preview lists joiners only.) |

**Design backlog alignment.** New item 10. Owns: wizard, three membership modes, three chat policies, name edits, skip.

**Breakouts themselves** (create N rooms, assign, broadcast, return to main) ship in this feature’s Meet half: host can open breakouts during the live room (Feature 8 dependency). Acceptance: N rooms, auto or manual assign, per-breakout chat and roster, close and return.

---

# Feature 11 — Roles, analytics, embeds, series and P2 polish

As an organiser running more than one session, I want staff roles, a simple funnel, an embed, and a series attached to a program or cohort — and the P2 polish items in this programme — so that Events scales without another product.

**Business problem:** One owner cannot check in and analyse alone. Events should attach to Enum education objects, not Luma consumer calendars.

**Solution:** Roles: owner, host, manager, check-in staff, community moderator. Analytics: views, reserve starts, completed Going, source (link/invite/import/embed), check-in rate, Join starts. Embed: card + widget. Event belongs to program/course/cohort/community/named series. P2 in this feature’s second slice: recurring (edit one vs series), location autocomplete, custom slug, Discover category/tag filters, related events, referral source, feedback after attendance, light branding, Meet raise-hand/reactions/Q&A, summary regenerate.

**Product objective:** Operations and growth without parked Luma chrome.

**Target users:** Owners, staff, program admins.

### Acceptance criteria

| Category | Specification |
|---|---|
| Access & entry point | Event settings → Team, Insights, Share/embed, Series. Recurring on create/edit. |
| Talent experience | Embed reserve uses Feature 1. Recurring: each date is its own Join. Feedback after checked-in or joined. |
| Core functionality | Check-in staff: scan/search only. Insights formulas documented. Embed source tagged. Series page lists occurrences. Recurring create N administrations. Slug unique; old slug redirects. |
| Validation rules | Cannot remove last owner. Slug charset constrained. |
| State management | Each occurrence has own roster, recording, grouping prompt. |
| UI states | Empty insights: “No views yet.” Empty series: add first date. |
| UI requirements | Role picker plain language. |
| Backend behaviour | Embed cannot bypass door. |
| Interactions & compatibility | P2 must not block P0/P1 release; ship behind the same event object. Out of scope still: follow-host, featured feed, API, wallet, WhatsApp. |
| Permissions | Owner assigns roles. |
| Edge cases | Recurring cancel one vs all: explicit choice. |
| Analytics events | `event_embed_loaded`, `event_occurrence_created`, `event_feedback_submitted`. |
| Audit trail | Role changes. |
| Dependencies | Features 1–10. |
| Success criteria | A program can own a weekly standup series; a door volunteer can check in without deleting the event. |

### Edge cases and error messages

| Scenario | What the system does | Message shown to the user |
|---|---|---|
| Remove last owner | Blocks | “Keep at least one owner.” |
| Slug taken | Blocks | “That link is already in use.” |
| Embed viewer not Going | Reserve in widget | (Feature 1 copy.) |
| Feedback before attend | Hide or block | “Feedback opens after you attend.” |

**Design backlog alignment.** New items 11a (roles/insights/embed/series) and 11b (P2 polish). Sequence 11b after 1–10.

---

# Out of scope (parked)

Do not implement in this build:

- Hide location until registered  
- Apple / Google Wallet passes  
- WhatsApp reminders  
- Coupons, unlock codes, group purchase, tax engine, invoices, refunds  
- Logged-out marketing pages and Open Graph social previews  
- Follow a host / public calendar follow  
- Featured Discover  
- Public API and Zapier  
- AI-written event descriptions  
- Crypto checkout and token-gating  

---

# What ships this build at a glance

| Feature | What ships | Why it matters |
|---|---|
| 1 Talent reservation loop | Cancel, `.ics`, Discover/Going/Past, timezone | Reservation is not a trap |
| 2 Tickets and check-in | QR ticket, scan/search | Physical/hybrid can run |
| 3 Registration controls | Capacity, questions, statuses, CSV export | The list is operational |
| 4 Organiser lifecycle | Cancel / archive / delete with recovery | No dead ends |
| 5 Communications | Email + SMS reminders (consent) | People show up |
| 6 Privacy, invites, CSV import | Hidden/count/visible, invite, import | Fill a cohort safely |
| 7 Demand and tickets | Approval, waitlist, blasts, basic paywall at Join | Serious ops |
| 8 Enum Meet | Time-aware Join, room, chat, roster | The product is the room |
| 9 Recording and summary | WhisperX/roster/LLM JSON notes | Key details and actions |
| 10 Community grouping | Roster → group; breakout → one/N/both; chat policy | After the call |
| 11 Roles, analytics, series, P2 | Staff, funnel, embed, series, polish | Scale |

## Order of work and forward dependencies

- Feature 1 lands first: Going/Cancelled is the identity every later door uses.
- Feature 3 statuses and capacity before 6 import and 7 waitlist.
- Feature 4 cancel-event before 8 can close a live room on organiser cancel.
- Feature 5 templates before 7 decision and 8 Join reminders.
- Feature 6 invites before 7 auto-approve invited.
- Feature 7 payment eligibility before 8 Join paywall.
- Feature 8 roster, chat, and breakouts before 9 and 10.
- Feature 9 pipeline can start once recording exists; publish targets include Feature 10 groups.
- Feature 10 must not run off RSVP lists — only roster.
- Feature 11 roles should exist before check-in staff (Feature 2) go to production doors; Insights after events have traffic.
- SMS (Feature 5) is blocked on Chioma’s NDPA sign-off; email ships first if SMS is not signed off.
- Strict recording/transcript access is blocked on the same privacy sign-off as Feature 9.
- P2 (11b) must not gate P0/P1.

## Success of the build

The programme is done when a talent can discover or accept an invite, reserve or pay, add a real calendar file, cancel, show a ticket, and Join at the right time; a host can import a CSV, hide the guest list, SMS opted-in people, and check them in; after a call the host can add joiners to one Community group, or split breakouts into their own groups with a chat-import choice; and a published summary names key details and action items whose owners were on the roster.

---

Enum · EFX · Events & Meet PRD · v1.0 · Confidential
