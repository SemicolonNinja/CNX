# Enum Events Product Priorities

## Purpose

This document is an actionable product roadmap for Enum Events. It was first written from an educator/admin comparison with Luma, then revised after a live review of the talent-facing events experience on `talent.dev.enumverse.com`.

The talent review changes the diagnosis: Enum already has a working attendee registration journey. The remaining work is to complete post-registration, attendance, and organizer operations, and to make the talent information architecture clearer.

The recommendations are grouped by priority:

- **P0 — Complete the journey:** Capabilities required for a dependable event experience.
- **P1 — Operate at scale:** Tools organizers and attendees need for larger or more complex events.
- **P2 — Improve growth and polish:** Features that improve discovery, retention, and differentiation.

## What changed after the talent review

The original P0 assumed Enum lacked attendee self-registration. That was an artifact of inspecting an already-ended event from the educator side. On the talent app, a signed-in user can discover events, reserve a spot, receive confirmation, and see the event on an internal calendar.

| Earlier assumption | Talent-side finding | Revised stance |
|---|---|---|
| Enum has no attendee self-registration | `Reserve a spot` → confirm modal → success modal → `Reserved` | Remove as a missing feature. Improve copy, states, and cancellation. |
| Enum has no event discovery | `/talent/event` supports search plus location and date filters | Keep as an enhancement, not a foundation gap. Add category filters and enrolled vs available views. |
| Enum has no calendar | `/talent/calendar` shows registered events in day/week views | Keep internal calendar. Add external `.ics` / Google / Apple / Outlook export. |
| Confirmation email is the main missing communication | In-app success toast and modal exist; notification settings include Events | Keep email and reminder delivery as a gap. Do not treat on-screen confirmation as missing. |
| Public event pages are thin | Talent event detail includes banner, dates, location, map, host, tags, copy link, and reserve CTA | The page exists. Missing pieces are ticket, join state, guest count, timezone, and unregister. |

## Product principles

1. **Complete the core journey before expanding discovery.** An attendee should be able to register, change their mind, add the event to a personal calendar, attend, and receive follow-up without organizer intervention.
2. **Design for educational events first.** Workshops, webinars, cohort sessions, office hours, orientations, and community events should guide product decisions.
3. **Make status and next actions explicit.** Organizers and attendees should always understand what happened, what state they are in, and what they can do next.
4. **Use progressive disclosure.** Keep basic event creation and reservation simple. Reveal ticketing, approval, questions, and communication settings only when needed.
5. **Treat communication and attendance as parts of the event lifecycle.** They should not feel like unrelated administrative tools.
6. **Keep talent and educator language aligned.** The same event should not feel like a different product depending on which app the user is in.

## Talent-side lifecycle that already works

Observed on `talent.dev.enumverse.com` for signed-in user James Bond:

1. Dashboard shows an Events count and an “Events today” preview.
2. Sidebar **Events** opens `/talent/event` with search and filters for Physical, Virtual, Hybrid, Today, This week, and This month.
3. Event cards show cover, title, category, date range, location type, host, and **View**.
4. Event detail `/talent/event/{id}` shows banner, Upcoming badge, dates, physical and/or virtual location, description, host, tags, map, **Reserve a spot**, and **Copy link**.
5. Reservation uses a confirmation modal, then a success modal that says the event was added to the calendar, plus a success toast.
6. The CTA changes to a disabled **Reserved** state.
7. The event appears immediately in `/talent/calendar` and in `/talent/calendar/events?status=UPCOMING`.
8. Calendar tabs exist for Upcoming, Ongoing, and Ended.
9. Notification settings include an Events category for invitations, reminders, and changes.

This is already a usable educational-event RSVP loop. It is not a missing product. It is an incomplete one.

# P0 — Complete the basic event journey

These items remain first because they block trust, attendance, or recovery. Self-registration itself is no longer in this list.

## 1. Cancel or change a reservation

### Problem

After reserving, the talent CTA becomes a disabled **Reserved** button. There is no unregister action on the event page or calendar popover. Attendees cannot recover from a mistaken RSVP, a schedule conflict, or a change of plans.

### Proposed experience

- When the user is registered, replace the disabled button with **You're going** plus **Cancel reservation**.
- Confirm the cancellation and explain whether a waitlisted person will be promoted.
- Restore **Reserve a spot** after success.
- Show the same action from My Events and the calendar event popover.
- Notify the organizer and update participant status to Cancelled.

### Acceptance criteria

- A registered attendee can cancel from the event page without educator support.
- The event is removed from Upcoming and remains visible in history if policy requires it.
- Capacity is released immediately.
- Duplicate cancel attempts are harmless.
- Private or ended events explain why cancellation is unavailable.

## 2. External calendar export

### Problem

The success copy says the event “has been added to your calendar,” but that means Enum’s internal calendar only. Talent users who live in Google Calendar, Apple Calendar, or Outlook will still miss the event.

### Proposed experience

- Change success copy to: “Reserved. This event is on your Enum calendar.”
- Offer **Add to Google Calendar**, **Apple Calendar**, **Outlook**, and **Download .ics**.
- Include timezone, location or meeting URL, and a link back to the Enum event.
- Keep those actions available after registration, not only on the success modal.

### Acceptance criteria

- A valid `.ics` file downloads for every confirmed reservation.
- Times are written with an explicit timezone.
- Updating or cancelling the Enum event can update or cancel the exported event where the calendar provider allows it.
- Virtual URLs are included only for eligible registered attendees.

## 3. Ticket, QR, and check-in artifact

### Problem

Physical and hybrid events have no attendee-facing ticket. There is no QR code, wallet pass, or “View ticket” state after reservation. Venue staff cannot verify registration without a separate process.

### Proposed experience

- After reservation, show **View ticket**.
- The ticket contains event name, date, attendee name, unique QR, and current status.
- Organizer check-in can scan the QR or search by name/email.
- Support already-checked-in, invalid, cancelled, and wrong-event results.
- Allow check-in reversal with an audit record.

### Acceptance criteria

- Every confirmed registration has a unique, non-guessable ticket code.
- Check-in works from a mobile browser.
- Repeated scans do not create duplicate attendance.
- Manual search remains available when camera access fails.
- Only authorized staff can change attendance.

## 4. Separate Discover from My Events

### Problem

Sidebar **Events** shows a mixed catalog of available, enrolled, and past events. Registered events live under Calendar tabs. Dashboard “Events: 7” does not explain whether that number is registered, upcoming, or catalog-wide. Users looking for “my events” take the wrong path.

### Proposed experience

On `/talent/event`, use tabs or filters:

- **Discover** — events the user can join
- **Going** — reserved upcoming and ongoing events
- **Past** — ended events the user reserved

Keep Calendar as the schedule view, not the only place to find registrations. Clarify dashboard counts with labels such as “2 upcoming” rather than a single unexplained total.

### Acceptance criteria

- A registered event appears under Going without relying on Calendar.
- Discover does not bury enrolled events among unrelated catalog items.
- Dashboard counts match the same definitions used in Events.
- Empty states explain the next action: browse events, or wait for upcoming sessions.

## 5. Time-aware Join for virtual and hybrid events

### Problem

Hybrid and virtual details expose an “Enum meet” link, but there is no prominent **Join** CTA, countdown, or happening-now state. It is unclear whether the link works before start time, during the event, or after it ends.

### Proposed experience

- Before start: show start time and countdown; keep Join disabled or labelled “Opens at start.”
- During the event: show a primary **Join event** button.
- After end: show **Event ended**.
- Hide or gate the raw meeting URL for unregistered visitors.
- If the link is missing, tell the attendee that the host has not added it yet.

### Acceptance criteria

- Registered attendees can join during the valid window without hunting through body copy.
- Unregistered users cannot use the meeting URL from the public page.
- Time windows respect timezone and early-entry policy.
- A missing or rotated link is visible to the host as an operational warning.

## 6. Honest confirmation, reminders, and timezone display

### Problem

On-screen confirmation exists, but reminder delivery to the attendee is not visible in the journey. Times appear as “4:00 pm” without a timezone, and the dashboard “Events today” preview showed `9:15am - 9:15am` for an event whose detail page said 4:00 pm.

### Proposed experience

- Send a confirmation email as well as the in-app modal.
- Use default reminders at 24 hours and 1 hour before start, respecting notification settings.
- Display timezone on every date, for example `Tue 8 Sep, 4:00 pm WAT`.
- Fix dashboard time rendering so preview, detail, and calendar never disagree.

### Acceptance criteria

- Reservation creates an in-app record and a transactional email.
- Reminder preference changes are honored.
- Failed email delivery is visible to organizers.
- The same event shows one canonical start and end time across dashboard, list, detail, and calendar.
- Daylight-saving and attendee-local conversion are defined and tested.

## 7. Organizer cancellation, archival, and deletion

### Problem

On the educator side, deletion failed with “Only cancelled events can be deleted,” while a cancelled state was not clearly available for the ended test event. Talent users also cannot leave an event. Both sides currently have recovery dead ends.

### Proposed experience

Separate the actions:

- **Cancel event:** Stop future activity and notify affected attendees.
- **Archive event:** Hide an ended or cancelled event from the default workspace view without destroying records.
- **Delete event:** Permanently remove an eligible event, with stricter rules when participants exist.

When an action is unavailable, explain why and provide the next valid action. For example: “This event must be cancelled before deletion. Cancel event.”

### Acceptance criteria

- Future events can be cancelled from the educator action menu.
- Cancellation previews attendee impact and sends notifications.
- Ended events can be archived.
- Deletion rules are consistent and documented.
- Error messages include a recovery action.
- Destructive actions require confirmation and are audit logged.

## 8. Capacity, remaining spots, and registration status on the talent page

### Problem

Talent event pages do not show remaining capacity, full state, or registration closing. Organizers therefore cannot communicate scarcity, and attendees cannot tell whether reserving is still possible until they try.

### Proposed experience

Show attendee-facing states:

- Reserve a spot
- Registration opens on {date}
- 12 spots left
- Event full
- Registration closed
- Event ended
- You're going

Organizer settings should include capacity, open/close dates, and whether remaining spots are visible.

### Acceptance criteria

- Confirmed registrations cannot exceed capacity under concurrent reserve requests.
- The talent CTA and helper text always match the current status.
- Lowering capacity below current registrations requires confirmation and does not silently remove attendees.

# P1 — Support serious event operations

## 9. Custom registration questions

Educational events commonly need role, organization, experience level, dietary requirements, learning goals, or accessibility needs. The current reserve flow only confirms the reservation; it does not collect extra answers.

Allow short text, long text, single choice, multiple choice, and acknowledgement questions. Answers must appear in participant detail and CSV export.

## 10. Participant statuses and CSV export

Use explicit states across educator and talent surfaces: Invited, Registered, Pending, Waitlisted, Cancelled, Checked in, and No-show. Add search, filters, and **Export CSV** with identity, status, timestamps, source, and question answers.

## 11. Approval workflow

Add **Require approval**. Applications enter Pending. Organizers approve or decline in bulk. Talent users see **Requested** instead of **Reserved** until a decision is made. Capacity is reserved only on approval.

## 12. Waitlist management

When capacity is reached, offer **Join waitlist**. Show waitlist position or at least a clear pending state. Define promotion order, response deadlines, and what happens if a promoted person does not confirm.

## 13. Guest messaging and segmentation

Add **Send message** from the participant list. Initial segments: registered, pending, waitlisted, checked-in, and no-shows. Preview recipient count before send. Keep this separate from mandatory transactional mail.

## 14. Event insights

Answer: page views, started vs completed registration, source, check-in rate, and registration over time. Start with trustworthy totals before adding charts.

## 15. Free ticket types, then paid tickets

Introduce named free ticket types, quantities, and sale windows first. Paid tickets need payment providers, receipts, taxes, refunds, and reporting and should follow only after cancellation and capacity are stable.

## 16. Virtual meeting integrations

Allow a pasted URL or auto-created Zoom / Google Meet session. Keep the URL hidden from unregistered visitors. Include it in ticket, confirmation, and Join CTA. Continue to work with a manual URL if an integration is unavailable.

## 17. Website embeds and share preview

Provide a compact event card and a full registration widget. Verify copied talent links work for logged-out users and produce a usable social preview. Logged-out visitors should see event details and a clear **Sign in to reserve** path.

## 18. Calendars and series inside Enum’s education model

Group events under a program, course, cohort, community, or named series rather than copying Luma’s consumer calendars. Each group needs a shareable schedule and ownership.

# P2 — Improve growth, retention, and polish

## 19. Recurring events

Repeat daily, weekly, monthly, or on selected dates. Editing one occurrence must be distinct from editing the series.

## 20. Location autocomplete

Use an address provider, keep structured venue data, and retain manual entry for unlisted venues.

## 21. Custom event URLs

Allow human-readable slugs with redirects after a change.

## 22. Category and tag filters on Discover

Talent browse already filters by location type and date. Add category and tag filters so education, business, and community events can be found without search.

## 23. Guest count and optional guest list

Show how many people are going. If privacy allows, show a limited attendee preview. This is social proof, not a substitute for organizer participant management.

## 24. Related events and host profile

Add more events from this host and similar upcoming events. Link the host name to a profile.

## 25. Post-event feedback and attendance history

Mark past events as attended or registered-but-absent. Allow a short rating and comment after check-in. Optional testimonial consent should be explicit.

## 26. Themes, richer descriptions, and timezone controls

Support cover layouts, accessible branding, formatted agendas, and a control to view times in event time or attendee-local time. Replace initial-letter placeholder banners with stronger defaults.

# Recommended delivery sequence

## Phase 1: Close the talent reservation loop

Ship cancel reservation, `.ics` export, timezone-correct times, Discover vs Going, and honest confirmation copy. These are the cheapest trust fixes and reuse the registration model that already exists.

## Phase 2: Make attendance real

Add tickets, QR check-in, Join-window behaviour, reminders, and organizer cancel/archive/delete. This is the difference between an RSVP list and an event operation.

## Phase 3: Control demand

Add capacity display, custom questions, approval, waitlists, participant export, and statuses that match across talent and educator apps.

## Phase 4: Help organizers run and grow events

Add messaging, insights, meeting integrations, embeds, series, then paid tickets and discovery polish.

# Cross-cutting requirements

Every priority should account for:

- Talent and educator surfaces using the same event states
- Mobile layouts and touch interactions
- Keyboard navigation and screen-reader labels
- Timezones and daylight-saving transitions
- Role-based permissions
- Audit history for sensitive actions
- Data export and retention rules
- Transactional-email delivery monitoring
- Clear loading, empty, success, and recoverable error states
- Concurrency around capacity, approval, and check-in
- Protection of attendee personal information
- Logged-out vs logged-in behaviour for copied event links

# Product-level success criteria

Enum Events should be considered lifecycle-complete when:

1. A talent user can discover an event, reserve a spot, add it to a personal calendar, cancel, and re-register without support.
2. Dashboard, Events, Calendar, and event detail never disagree about time or registration state.
3. A registered attendee can join a virtual event at the right time or present a ticket at a physical event.
4. An organizer can understand every participant state and export the list.
5. Capacity and registration rules remain correct under concurrent use.
6. Event changes and cancellations reach affected attendees.
7. Staff can record attendance efficiently.
8. Every blocked or destructive action explains the reason and recovery path.

# Validation note

Educator-side review was completed on `educator.dev.enumverse.com`. Talent-side review was completed on `talent.dev.enumverse.com` with a signed-in talent user. Self-registration, browse, internal calendar, copy-link, and notification settings were directly observed. The following remain unverified and should not be treated as absent or complete:

- Logged-out public event pages
- Confirmation and reminder emails actually arriving
- Waitlist and approval states
- Paid tickets
- Mobile and accessibility audits
- Check-in against a live QR code
- Social-share preview cards

A test reservation was created from the talent app during this review. Cancel-reservation could not be completed because the action was not exposed.
