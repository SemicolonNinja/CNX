# Events docs

## Live (as-built)

Switch org vs talent from the top-left **JI** avatar (Organization vs **Talent**).

| Side | Doc | Screenshots |
|------|-----|-------------|
| **Educator / admin** | [EVENTS_REQUIREMENTS_AS_BUILT.md](EVENTS_REQUIREMENTS_AS_BUILT.md) — Calendar on `educator.dev.enumverse.com/admin/events`: list, create/edit, filters. No Talent create. | [as-built-ui/](as-built-ui/) |
| **Talent** | [TALENT_EVENTS_REQUIREMENTS_AS_BUILT.md](TALENT_EVENTS_REQUIREMENTS_AS_BUILT.md) — `talent.dev.enumverse.com`: discover, Reserve / Reserved, Copy link, Enum meet, calendar. **No** create, tickets, RSVP form, or unreserve. | [as-built-ui/talent/](as-built-ui/talent/) |

HTML prototype: [`../../index.html`](../../index.html) — grok live loop (discover → confirm reserve → calendar) with PRD hung on existing CTAs (cancel, ticket, Join). Educator Calendar chrome; extra PRD on create modal and event detail.

## Next build

| Doc | What it is |
|---|---|
| [Events & Meet PRD v1.1](../enum-events-meet-prd.md) | Door / room / after — 11 features, AC tables |
| [UI overlay](../events-existing-ui-overlay.md) | Plug those features into **existing** chrome; no restyle |
| [Full requirements](../enum-events-full-requirements.md) | P0–P2 backlog (E1–E37) and parked Luma items |
| [Product priorities](../enum-events-product-priorities.md) | Talent-side findings and why P0 changed |

Repo index: [`../../README.md`](../../README.md).
