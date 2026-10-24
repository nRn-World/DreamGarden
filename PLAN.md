# Dream Garden — Product Plan

## 1. Product statement

Dream Garden is a low-pressure garden sim for people who want five quiet minutes between other
things. The player tends a floating island at night, grows impossible flowers, befriends the spirits
that live among the petals, and slowly learns why the garden was left waiting.

The commercial goal is a premium-feeling free game that a player would voluntarily support: no
energy walls, no loot boxes, no ad interrupts. Revenue is designed around optional cosmetic
support, not coercion. See [docs/MONETIZATION.md](docs/MONETIZATION.md).

## 2. Audience and positioning

- **Primary:** 24–45, cozy-game players, fans of *A Little to the Left*, *Spiritfarer* and
  *Cozy Grove*; mostly phone play in short evening sessions.
- **Secondary:** players who want a calm, offline game with no account and no ads.
- **Pillars:** gentleness, tactility, mystery, respect for the player's time.
- **Anti-pillars:** streak punishment, FOMO events, artificial scarcity, manipulative notifications.

## 3. Core loop

```
open app → collect offline growth → harvest → choose: wish order / sell / offer to spirit
        → spend dew on seeds or beds → plant → leave or boost → return later
        ↓
     story chapter unlocks → new flower / spirit / decoration → visible progress
```

Session target: **2–6 minutes**. Daily engagement is encouraged by a night gift and three free
boosts, never required. A player who disappears for a month loses nothing.

## 4. Content shipped in v1.0

| Content | Count | Notes |
| --- | --- | --- |
| Garden beds | 12 | 6 free, 6 at levels 3, 5, 8, 11, 14, 17 |
| Flowers | 8 | Dewbell → Eternity Bloom, 45 s to 8 h |
| Spirits | 6 | 1 passive each, bond 0–5 |
| Story chapters | 6 | ~150–220 words each, English source + translations |
| Wish orders | 3 rotating | Plant + count + dew/stardust/XP reward |
| Decorations | 6 | Pond, lantern, arch, bench, mushrooms, chimes |
| Achievements | 12 | All possible without spending money |
| Languages | 7 | en, sv, tr, es, ar (RTL), fr, ja |
| Daily systems | 2 | Night gift (20 h cooldown, streak), Moonwell (3 free boosts/day) |

Progression is tuned so the first hour reaches levels 2–4, the first week reaches the mid-game and
the full story is reachable in two to three weeks of casual play (or faster with active play).

## 5. Milestones

| Milestone | Deliverable | Status |
| --- | --- | --- |
| M0 — Foundation | Vite/React/TS scaffold, tokens, shell, routing | Done |
| M1 — Domain | Types, content, engine, save/repair, tests | Done |
| M2 — Garden | Procedural art, beds, growth, harvest, HUD | Done |
| M3 — Meta | Shop, wishes, spirits, decor, story, achievements, settings | Done |
| M4 — First run | Onboarding, language picker, tutorial, title, offline report | Done |
| M5 — i18n | Six full translations, RTL, flags, parity tests | Done |
| M6 — Platform | PWA manifest, service worker, icons, install, offline | Done |
| M7 — Release prep | Documentation, store assets, QA report | Done locally |
| M8 — Store release | Signing, store accounts, native wrapper, review | Owner action (see HUMAN_ACTIONS.md) |

## 6. Non-goals for v1.0

- No accounts, cloud sync or social features.
- No seasonal live events or limited-time content.
- No native Android/iOS project committed; packaging is documented via Capacitor.
- No ad SDK or billing SDK wired into the web build. Both need store credentials and owner consent;
  the revenue design and integration points are documented instead of stubbed with fake UI.
- No push notifications. The game never nags.

## 7. Success measures (to instrument only after adding consent-based analytics)

- D1 / D7 return rate.
- Median session length and sessions per day.
- Share of players who finish Chapter 3 (content pacing health).
- Voluntary supporter conversion (target 1–3 % of active players).
- Crash-free sessions > 99.5 %.

The current build ships **no analytics** by design. Any measurement requires a privacy update and
explicit consent before release.
