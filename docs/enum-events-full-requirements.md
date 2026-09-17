# Enum Events and Enum Meet — Full Requirements

## Purpose

This is the scoped backlog for Enum Events plus Enum Meet.

Events is the **door**: create, discover, reserve, pay or approve, remind, check in. Meet is the **room**: a live session with a paywall, host messaging, and groups. After the call, people and chats can continue in **Community**.

The same event object serves a public ticketed session and an internal cohort standup. Only the access rule changes.

## How to read this

- **P0** — Without this the journey is broken or untrustworthy.
- **P1** — Needed to operate a real event or live class.
- **P2** — Growth, polish, and depth.
- **Already shipped** — Observed on talent/educator; do not rebuild.
- **Out of scope** — Parked Luma items. Do not pull them into this build.

## Product model

```
Door (Events) → Room (Meet) → After (Community + notes)
```

- **Door:** who may attend, and how they are told.
- **Room:** Join, A/V, chat, host controls, breakouts, recording.
- **After:** summary, action items, community groups, next session.

## Already shipped (do not treat as missing)

Observed on `talent.dev.enumverse.com` and `educator.dev.enumverse.com`:

- Talent browse with search and location/date filters
- Event detail (banner, dates, location, map, host, tags, copy link)
- Reserve a spot → confirm modal → success → Reserved
- Internal Enum calendar (day/week, Upcoming / Ongoing / Ended)
- Notification settings with an Events category
- Educator create (public/private, image, category, description, physical/virtual/hybrid, tags, reminder dropdown)
- Participant list and duplicate event

Improve these; do not recreate them. Self-registration is **not** a P0 gap.

## Out of scope (parked)

Do not build in this programme:

- Hide location until registered
- Apple / Google Wallet passes
- WhatsApp reminders
- Coupons, unlock codes, group purchase, tax engine, invoices, refunds/chargebacks
- Logged-out marketing pages and Open Graph social previews
- Follow a host / follow a public calendar
- Public “featured events” feed
- API and Zapier
- AI-written event descriptions
- Crypto checkout and token-gating
- Theme marketplace beyond a small branded cover set

Basic **free and paid ticket types** stay in scope. Full commerce operations do not.

---

# P0 — Complete the basic journey

## E1. Cancel a reservation

Attendees can leave an event they reserved.

- Event page and calendar show **You're going** and **Cancel reservation**, not a dead Reserved button.
- Confirm impact (including waitlist promotion when that exists).
- Status becomes Cancelled; capacity is released; organizer is notified.
- Ended or private events explain why cancel is unavailable.

## E2. External calendar file

Reservation adds the event to Enum’s calendar **and** offers a real calendar file.

- Download `.ics` with timezone, location or Join URL, and Enum event link.
- Buttons for Google Calendar, Apple Calendar, Outlook.
- Success copy: “Reserved. This is on your Enum calendar.” plus add-to-calendar actions.
- Eligible attendees only receive the meeting URL in the file.

## E3. Ticket and check-in

Physical and hybrid events need a proof of registration and a door flow.

- Attendee **View ticket** with name, event, status, unique QR.
- Organizer check-in: scan QR or search name/email.
- Results: success, already checked in, cancelled, wrong event.
- Reverse check-in with audit log.
- Counts: registered, checked in, no-show.

## E4. Discover vs Going

Talent Events must separate catalog from “my events.”

- Tabs or filters: **Discover** | **Going** | **Past**.
- Dashboard counts use the same definitions (for example “2 upcoming”), not one unexplained “7 events.”
- Calendar remains the schedule view, not the only place registrations live.

## E5. Time-aware Join (Meet P0)

Join is the product, not a pasted URL in the description.

- Access is checked at Join: reserved, invited, member, approved, or paid — same rule as the door.
- States: **Opens at start** (optional early entry) → **Join event** while live → **Event ended**.
- Unregistered people cannot use the room URL.
- If no room exists yet, host and attendee see “Host has not opened the room.”
- Times always include a timezone. Dashboard, list, detail, and calendar must not disagree.

## E6. Confirmation and reminders (email)

On-screen success is not enough.

- Transactional email on: reserved, approved/declined, reminder (24h and 1h defaults), updated, cancelled.
- Reminder timing is previewable. Event time, place, and Join stay system-controlled.
- Failed delivery is visible to the organizer.
- Honour Events notification settings.

## E7. Organizer cancel, archive, delete

No dead ends like “Only cancelled events can be deleted” without a Cancel action.

- **Cancel event** — stop the event, notify affected people, close Join.
- **Archive** — hide from default lists, keep records.
- **Delete** — only when policy allows; stricter if participants exist.
- Every blocked action names the next valid action.

## E8. Capacity and registration status

- Open / closed / opens-on-date; optional numeric capacity; optional remaining-spot copy.
- Public states: Reserve, opens on, X spots left, full, closed, ended, You’re going.
- Confirmed registrations cannot exceed capacity under concurrent reserve.

## E9. Custom registration questions

- Short text, long text, single choice, multiple choice, acknowledgement.
- Required toggle, reorder, templates for education events.
- Answers on participant detail and CSV. Changing questions after people have registered warns the host.

## E10. Participant statuses and CSV export

Statuses: Invited, Registered, Pending, Waitlisted, Cancelled, Checked in, No-show.

- Search, filter, export CSV (identity, status, timestamps, source, answers).
- Export is permissioned and audit-logged. Neutralise spreadsheet formula injection.

## E11. Meet room baseline

A usable live room for the people who passed the door.

- Camera, mic, screen share, device-permission errors with recovery.
- Host: mute, remove, lock room, end meeting.
- In-room chat (main room). Persist chat for the post-call grouping flow.
- Roster of Enum identities in the call (required later for groups and summaries).
- Same room object for public ticketed and private cohort events.

---

# P1 — Operate a real event and a real room

## E12. Guest-list privacy

The host controls whether attendees are visible to each other.

Settings:

- **Hidden** — only hosts and managers see the list (default for private/cohort if desired).
- **Count only** — “24 going,” no names.
- **Visible to guests** — names/avatars on the event page; each attendee can opt out of appearing.

Rules:

- Email addresses are never on the public list.
- Hidden list still exports for the organizer.
- Talent Going/Discover never leak hidden guests.

## E13. Invites and CSV import

Hosts can pull people in without waiting for Discover.

- Invite by email (one or many). Invited people are Invited until they accept or reserve.
- Optional personal message. Invite link is scoped to that event.
- **CSV import:** name, email, optional ticket type / role. Validate rows, show errors, import the rest.
- Imported people can be marked Invited or Registered (host choice).
- Duplicate emails are skipped with a report.
- Auto-approve invited guests even if approval is on.

## E14. SMS reminders

Same lifecycle events as email, on SMS, for users who opted in.

- Channels: in-app, email, SMS. WhatsApp stays out of scope.
- SMS templates are short: event name, time, Join or venue, cancel instructions.
- Opt-in/out lives in notification settings. No SMS to people who did not consent.
- Delivery status (sent / failed / unsubscribed) on the participant or blast record.
- Do not put the raw meeting URL in SMS unless the user is already eligible.

## E15. Approval

- Require approval per event or ticket.
- Talent sees **Requested** until decided.
- Host Pending queue: approve/decline single or bulk; optional decline note.
- Capacity is consumed on approval, not on request.
- Email (and SMS if opted in) on decision.

## E16. Waitlist

- At capacity, **Join waitlist**.
- Host promotes manually first; auto-promote is optional later.
- Define order, optional response deadline, and expiry behaviour.
- Talent sees waitlisted vs going vs requested.

## E17. Guest messaging and segmentation (email, plus SMS if opted in)

- Send from the participant list to: all registered, pending, waitlisted, checked-in, no-shows, invited.
- Preview recipient count, excluded addresses, and schedule vs send now.
- Separate from mandatory transactional mail.

## E18. Free and paid ticket types (basic)

In scope: name, description, Free or price, quantity, sale window, per-person cap, visibility.

Paywall must apply at **Join**, not only at reserve. If payment is incomplete, Join stays closed.

Out of scope here: coupons, unlock codes, group checkout, tax engine, invoices, refunds.

## E19. Host and team permissions

Roles: owner, host, manager, check-in staff, community moderator (for post-call groups).

Check-in staff can scan and search; they cannot change tickets or delete the event.

## E20. Event analytics (basic)

Views, reserve starts, completed registrations, source (link vs invite vs import), check-in rate, Join starts. Define date range and formula. Charts can wait.

## E21. Website embed

Compact card and full event + reserve widget. Responsive and accessible. Source tagged as embed.

## E22. Meet: paywall and membership at the door of the room

- Re-check access when Join is pressed (ticket still valid, not refunded/cancelled, membership still active).
- Waiting room for early arrivals or approval-gated sessions.
- Kick / revoke mid-call updates the roster and community-add eligibility.

## E23. Meet: breakouts

Host can split the room into breakout sessions.

- Create N rooms, assign automatically or manually.
- Broadcast a message to all breakouts.
- Each breakout has its own roster and its own in-call chat.
- Close breakouts and return everyone to the main room.

## E24. Meet: recording

- Host starts/stops recording with a visible indicator.
- Recording inherits the same access as Join (registered/paid/member).
- Store recording against the event. Eligible people can replay.

## E25. Call summary, key details, and action items

After the call (or after recording stops), produce a structured note:

- Short summary
- Key details / decisions
- Action items (task, suggested owner if identifiable, due date if spoken, confidence)
- Link back to the transcript (hosts only by default)

Host can edit and then **share with attendees** or **share with the community group**.

Attendees do not get a summary until the host publishes, unless the host set auto-publish.

See **Call intelligence (open source)** below for the recommended stack.

## E26. Add call members to a Community group

When the call ends (or from a host prompt near the end):

**Add these people to a Community chat group.**

Options:

1. **Existing group** — add eligible members to a group the host picks (must have permission).
2. **New group** — create a group named from the event (editable), under Community chats.
3. **Skip**

Eligibility: people who **joined the room** (not merely reserved), minus those who left before a host-defined threshold if we add one (default: anyone who joined).

Do not add people who only had a cancelled reservation.

The group is a normal Community chat: members can continue the conversation after the event.

## E27. Breakout → groups and chats

If the call used breakouts, the host gets a **post-call grouping** step. This is required, not optional copy.

The host chooses **one** membership model:

| Choice | Members | Chats |
|---|---|---|
| **One group for everyone** | All main-room joiners in a single Community group | Main-room chat can be copied in as the opening thread. Breakout chats are attached as separate threads or as files in that group (host picks). |
| **One group per breakout** | Each breakout roster becomes its own Community group | That breakout’s in-call chat becomes that group’s starting history. Main-room chat can be copied into all groups, into none, or into a separate “plenary” group. |
| **Both** | Plenary group **and** per-breakout groups | Main chat → plenary. Each breakout chat → its group. People who were in a breakout land in both. |

Also decide **chat history**:

- **Include in-call chats** in the Community group(s)
- **Members only** — create groups, do not import chat
- **Discard breakout chats** — keep members, drop those transcripts

Rules:

- Empty breakouts create no group.
- A person in two breakouts over time is added to each corresponding group if “per breakout” is on.
- Hosts/co-hosts are added to every created group.
- Group names default to `{Event name} — {Breakout name}` and are editable before confirm.
- This step can be deferred; it must remain available from the ended event until the host dismisses it.

## E28. Program / course / cohort / series attachment

An event can belong to a program, course, cohort, community, or named series. The series page lists upcoming sessions. This is Enum’s calendar model, not Luma consumer calendars.

---

# P2 — Growth and polish

## E29. Recurring events

Daily / weekly / monthly / selected dates. Edit one occurrence vs the series. Each occurrence has its own room, recording, and grouping prompt.

## E30. Location autocomplete

Address provider with map pin; manual entry still allowed.

## E31. Custom event URLs

Human-readable slug. Redirect the old slug.

## E32. Discover filters and related events

Category and tag filters. “More from this host” and similar upcoming events. Host name links to a profile. No public follow-host product.

## E33. Referral source tracking

Source-aware share links (invite vs import vs copy vs embed). No public personal referral leaderboard.

## E34. Post-event feedback

Optional short survey after attendance: rating, comment, optional testimonial consent. Past events show attended vs registered-but-absent.

## E35. Branding and descriptions

Small set of cover layouts, org colours with accessible contrast, formatted agenda. Replace initial-letter placeholder covers with stronger defaults.

## E36. Meet polish

Raise hand, reactions, Q&A queue, pin speaker, optional countdown on the event page, attendee-local vs event-local time toggle.

## E37. Summary quality loop

Host edits summary before publish; flag low-confidence action items; regenerate; export markdown/PDF to the group.

---

# Call intelligence — open source recommendation

Do **not** bolt on a desktop note-taker. Enum owns the room, so capture audio from Enum Meet and run a pipeline Enum controls.

## Recommended build (primary)

| Stage | Use | Why |
|---|---|---|
| Capture | Enum Meet recording (server mix + roster timestamps) | Roster IDs beat “Speaker 2” for action owners and group adds |
| Speech-to-text | [faster-whisper](https://github.com/SYSTRAN/faster-whisper) or [WhisperX](https://github.com/m-bain/whisperX) | Standard self-hosted ASR, word timestamps, good accuracy |
| Who spoke | Map chunks to **Meet roster** first; fill gaps with [pyannote.audio](https://github.com/pyannote/pyannote-audio) | Diarization alone will not know Enum users |
| Structure | LLM already in Enum, or local OpenAI-compatible (vLLM / Ollama) with a **JSON schema**: `summary`, `key_details[]`, `decisions[]`, `action_items[{task, owner_user_id?, due, confidence, quote}]` | Deterministic UI, not a blob of prose |
| Guardrails | Pydantic (or equivalent) schema validation; do not invent owners who were not on the roster | Stops hallucinated assignees |

**WhisperX + roster + structured LLM** is the production path. Treat [MIA](https://github.com/nguyenvmthien/MIA) as a **prompt/schema reference** for action items, not as the product.

Pyannote model weights are **gated on Hugging Face**. Someone must accept the model terms and store `HF_TOKEN` in Enum’s environment. Plan for that.

## What not to adopt as the core

| Tool | Role | Verdict |
|---|---|---|
| [Meetily](https://github.com/Zackriya-Solutions/meetily) | Local desktop recorder + Whisper + Ollama | Good for personal notes. Wrong shape for a multi-tenant Meet product. |
| [Vexa](https://github.com/Vexa-ai/vexa) | Bot joins Google Meet / Teams / Zoom, Apache-2.0 | Use only if Enum still supports **external** Meet/Zoom as the room. Not needed when Enum Meet is the SFU. |
| [Minutes](https://github.com/manor-os/minutes) | Self-hosted Whisper + Ollama app | Useful UX reference (summary + assignees + deadlines). Do not run it as a second product. |
| Otter / Fireflies / Recall.ai | Hosted | Out of scope unless legal later requires a vendor fallback. |

## Acceptance criteria for summaries

- Pipeline runs from the event recording without a human uploading a file.
- Output includes summary, key details, and action items.
- Action-item owners are Enum users from the roster or marked “unassigned.”
- Host can edit, then publish to attendees and/or the Community group from E26/E27.
- Breakout recordings can produce **per-breakout notes** when per-breakout groups are created.
- Failure is visible: “Summary unavailable” with retry, never a silent empty page.
- Audio and transcripts follow the same access rules as the recording.

---

# Cross-cutting requirements

Apply to every item:

- Talent and educator use the **same** event, participant, and room states
- Mobile web for reserve, ticket, Join, check-in
- Keyboard and screen-reader labels on primary flows
- Timezones and DST
- Role-based permissions and audit logs for invites, imports, check-in, grouping, summary publish
- Concurrency on capacity, Join, and check-in
- Personal data: guest-list privacy, SMS consent, transcript access
- Loading, empty, success, and recoverable error states
- Dual strategy: public ticketed and private cohort differ only by door rules

## Dual-strategy examples

| | Public masterclass | Cohort standup |
|---|---|---|
| Door | Discover + paid or free reserve | Invite / program membership |
| Guest list | Count only or visible | Hidden |
| Room | Same Meet | Same Meet |
| After | Optional community group | Always add to the cohort group |
| Breakouts | Host chooses one group vs per-breakout groups | Usually per-breakout project groups |

---

# Delivery sequence

**Phase 1 — Close the talent loop**  
E1–E4, E6–E10 (cancel, calendar file, ticket/check-in, Discover/Going, email, organizer lifecycle, capacity, questions, CSV).

**Phase 2 — Ship the room**  
E5, E11, E22 (Join with access check, baseline A/V and chat, waiting room).

**Phase 3 — Operate**  
E12–E21 (privacy, invites, CSV import, SMS, approval, waitlist, messaging, tickets, roles, analytics, embed).

**Phase 4 — After the call**  
E23–E27, call intelligence (breakouts, recording, summary, community groups, breakout grouping).

**Phase 5 — Polish**  
E28–E37.

---

# Success criteria

The programme is done when:

1. A talent user can discover or accept an invite, reserve or pay, add a real calendar file, cancel, re-register, show a ticket, and Join at the right time.
2. A host can import a CSV, invite, hide or show the guest list, message segments, and check people in.
3. SMS reminders go only to opted-in people and match the same events as email.
4. Public and cohort events use one room type with different doors.
5. After a call, the host can add joiners to one Community group.
6. After breakouts, the host can put each breakout (members and/or chats) into its own group, or everyone into one group, or both.
7. A published summary contains key details and action items, with owners limited to people who were on the call.
8. Cancel/archive/delete never dead-end. Dashboard, Events, Calendar, and Meet never disagree on time or status.

---

# Validation caveats

- Talent RSVP was tested; educator-side registration was not, because the first test event had already ended.
- Paid Join, SMS, live Meet, breakouts, grouping, and summaries were not exercised in production.
- Mobile and accessibility were not audited.
- Some controls may already exist behind another role or flag — confirm before rebuilding.

---

# Requirement index

| ID | Item | Priority |
|---|---|---|
| E1 | Cancel reservation | P0 |
| E2 | `.ics` / external calendar | P0 |
| E3 | Ticket + QR check-in | P0 |
| E4 | Discover / Going / Past | P0 |
| E5 | Time-aware Join + timezone | P0 |
| E6 | Email confirmation and reminders | P0 |
| E7 | Organizer cancel / archive / delete | P0 |
| E8 | Capacity and registration status | P0 |
| E9 | Custom questions | P0 |
| E10 | Statuses + CSV export | P0 |
| E11 | Meet room baseline | P0 |
| E12 | Guest-list privacy | P1 |
| E13 | Invites + CSV import | P1 |
| E14 | SMS reminders | P1 |
| E15 | Approval | P1 |
| E16 | Waitlist | P1 |
| E17 | Guest messaging | P1 |
| E18 | Free/paid tickets (basic) + Join paywall | P1 |
| E19 | Host/team roles | P1 |
| E20 | Analytics | P1 |
| E21 | Embed | P1 |
| E22 | Meet access re-check / waiting room | P1 |
| E23 | Breakouts | P1 |
| E24 | Recording | P1 |
| E25 | Summary + action items | P1 |
| E26 | Add call members to Community group | P1 |
| E27 | Breakout → unique groups or one group; chat import choices | P1 |
| E28 | Program/cohort/series | P1 |
| E29 | Recurring | P2 |
| E30 | Location autocomplete | P2 |
| E31 | Custom URLs | P2 |
| E32 | Discover filters / related | P2 |
| E33 | Referral source | P2 |
| E34 | Feedback + attendance history | P2 |
| E35 | Branding | P2 |
| E36 | Meet polish | P2 |
| E37 | Summary edit/publish loop | P2 |
