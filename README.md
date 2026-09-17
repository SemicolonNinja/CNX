# CNX — Enum Events docs and UI prototype

This repo is **documentation plus a static HTML prototype**. It is not the Enum production app.

The HTML follows the **live as-built chrome** (educator Calendar + talent Events/Calendar), then hangs **PRD v1.1** behaviour on those same controls ([UI overlay](docs/events-existing-ui-overlay.md)). It does not invent a second Talent product or restyle pages to look like Luma.

## What this prototype covers

Door → room → after on one event object. Parked Luma items (Wallet, WhatsApp, coupons, follow-host, featured Discover, etc.) stay out.

| Feature | In the prototype |
|---|---|
| 1 Talent reservation loop | Reserve confirm → You’re going / Cancel · `.ics` / Google / Apple / Outlook · **Events tabs Discover / Going / Past** · host calendar subscribe · timezone WAT · cancel blocked if ended · “arrived — cancel anyway?” |
| 2 Tickets and check-in | View ticket + QR · scan / name search · camera denied fallback · offline “Connect to check in.” · already / wrong event / cancelled · reverse · No-show after end |
| 3 Registration controls | Capacity, remaining spots, **open / closed / opens-on**, question builder (short, long, single, multiple, ack, reorder), statuses, formula-safe CSV export |
| 4 Organiser lifecycle | Cancel / Archive / Delete with recovery copy · talent sees cancelled + Join closed |
| 5 Communications | Reminder dropdown + preview · talent **Settings → Events** in-app / email / **SMS** · failed SMS on the participant list |
| 6 Privacy, invites, import | Hidden / count / visible · guest opt-out · invite emails · **CSV import preview** (good vs skipped rows) |
| 7 Demand and tickets | Approval, waitlist + promote (cancel frees a spot), blasts, paid ticket, **paywall at Join** |
| 8 Enum Meet | Time-aware Join · waiting room · camera / mic / share · host mute / remove / lock / end · chat · roster · breakouts |
| 9 Recording and summary | Record indicator · processing / retry / draft / publish · owners from roster or Unassigned · talent notes after publish |
| 10 Community grouping | Roster-only wizard · one / per-breakout / both · chat policy · empty roster copy |
| 11 Roles, analytics, series, P2 | Insights chips · roles · **Copy embed** · Duplicate / series field · slug · **Leave feedback** after attend |

## Run

```bash
python3 .preview-server.py
```

Serves `http://127.0.0.1:4174/` (also `http://[::1]:4174/`). Origin is **HTTP/1.0 + Content-Length** so the Cursor preview proxy cannot re-chunk the body (Chromium `-354` / `ERR_INVALID_CHUNKED_ENCODING`).

Open `http://127.0.0.1:4174/` — **JI** switches Organization ↔ Talent.

Clock frozen **15 Sep 2026, 07:10 WAT**. Educator weeks start Sunday. Talent month starts Monday.

## Walk

1. Talent → **Events** → Discover / Going / Past. **Ay Live** → Reserve → questions if any → confirm → `.ics`. Event appears under **Going**.
2. **Team Culture Fit** is already Going (Cancel / ticket). **Paid cohort clinic** is unpaid — Join is blocked until Pay.
3. **Test not logged in** shows “Registration opens on…”.
4. Settings → Events → SMS toggle.
5. Educator → Calendar → event ⋯ → Check in, Import CSV (preview), Export, Send message, Copy embed, Summary, Add to Community, Start room.

Clear `localStorage` key `enumverse-prd-proto-v2` to reset seed.

| Doc | What it is |
|---|---|
| [Talent as-built](docs/events/TALENT_EVENTS_REQUIREMENTS_AS_BUILT.md) | Live Talent screens |
| [Educator as-built](docs/events/EVENTS_REQUIREMENTS_AS_BUILT.md) | Live educator Calendar |
| [UI overlay](docs/events-existing-ui-overlay.md) | Where PRD attaches without restyle |
| [PRD v1.1](docs/enum-events-meet-prd.md) | Door / room / after |
