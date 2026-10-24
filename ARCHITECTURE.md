# Architecture

## 1. Shape of the system

Dream Garden is a static single-page application. There is no backend, no account and no network
request at runtime. The whole game is deterministic data plus a small store.

```
┌──────────────────────────────────────────────────────────────┐
│ UI (React)                                                   │
│  screens/ · components/ · styles/                            │
│  reads store selectors, dispatches user intents              │
└───────────────────────────────┬──────────────────────────────┘
                                │ zustand actions
┌───────────────────────────────▼──────────────────────────────┐
│ Application store — src/game/store.ts                        │
│  save state, active sheet, toasts, offline report, audio     │
│  schedules debounced persistence, ticks growth clock         │
└───────────────┬─────────────────────────────┬────────────────┘
                │                             │
┌───────────────▼─────────────┐  ┌────────────▼───────────────┐
│ Domain — engine.ts          │  │ Persistence — save.ts      │
│  pure functions over       │  │  localStorage + backup,    │
│  SaveState + timestamp     │  │  validation, repair,       │
│  growth, economy, xp,      │  │  import/export             │
│  orders, achievements      │  └────────────────────────────┘
└───────────────┬─────────────┘
                │
┌───────────────▼─────────────┐
│ Content — content/*.ts      │
│  plants, spirits, decor,    │
│  chapters, achievements,    │
│  progression tables         │
└─────────────────────────────┘
```

The domain layer knows nothing about React, the DOM or storage. It can be unit-tested with plain
objects and a timestamp. This is the boundary that makes balance changes safe.

## 2. Key modules

| Module | Responsibility |
| --- | --- |
| `src/game/types.ts` | All domain types; no runtime code |
| `src/game/content/plants.ts` | 8 flower definitions, palettes, grow times, yields, unlock levels |
| `src/game/content/spirits.ts` | 6 spirits, bond offers, passives, 6 decorations |
| `src/game/content/progression.ts` | Level curve, bed unlocks, 6 chapters, 12 achievements |
| `src/game/engine.ts` | Growth math, harvest, selling, orders, XP, bonds, daily gifts, moonwell, next-goal |
| `src/game/save.ts` | Versioned persistence, schema repair, backup recovery, import/export |
| `src/game/store.ts` | Zustand store; user intents; debounced save; clock |
| `src/game/audio.ts` | WebAudio ambience/chimes and vibration, both opt-in |
| `src/i18n/*` | Typed dictionaries, interpolation, number/date/duration formatting, locale metadata |
| `src/components/PlantArt.tsx` | Procedural SVG flowers, 4 stages, 8 shapes |
| `src/components/SpiritArt.tsx` | Procedural SVG spirits |
| `src/components/GardenScene.tsx` | Island composition, beds, companions, decor, fireflies |
| `src/components/SheetHost.tsx` | Bottom-sheet router for all modal flows |
| `src/screens/*` | Full-screen sections behind the bottom navigation |

## 3. State and time

- `SaveState` is a plain serializable object. Every mutation clones it, applies a pure engine
  function, then writes it back through Zustand.
- Growth is never stored as a countdown. A plant stores `plantedAt` and `watered`; remaining time is
  derived from `now`. This makes offline growth, clock changes and background resume consistent, and
  keeps saves tiny.
- A single interval updates `now` about once per second while the app is visible. Rendering never
  runs a timer per plant.
- `visibilitychange` triggers a re-read of `now` and a save flush, so returning from the background
  is immediate.
- All econ math is integer dew/stardust. Quantities are clamped before use.

## 4. Progression rules (summary)

- Level XP requirement: `round(60 × level^1.25)` (see `levelXpNeeded`).
- Even levels grant 1 stardust; each level may unlock a seed, bed or decoration.
- Harmony rises with bonded spirits and planted variety, and adds a dew bonus when selling and
  filling wishes.
- Orders: 3 slots, refreshed on demand with a cooldown, rewards derived from plant value and spirit.
- Spirit bond: offering flowers fills a bond meter; each level strengthens that spirit's passive.
- Daily gift uses a local-date key and a 20-hour cooldown, and grows a streak up to seven days.
- Moonwell: 3 free boosts per local day; further boosts cost stardust. Boosts never expire unused.

## 5. Persistence

- Primary key: `dreamgarden.save.v1`.
- Backup key: `dreamgarden.save.backup.v1`, written before replacing a healthy save.
- Settings key: `dreamgarden.settings.v1` (locale, audio, motion, text size).
- `SAVE_VERSION = 1`; the envelope and save both carry `version`.
- On load, `repairSave` rebuilds a valid save field by field: unknown keys dropped, numbers bounded,
  invalid plants/orders/spirits discarded, missing fields defaulted. A broken save falls back to the
  backup, then to a fresh garden. The player is told when recovery happened.
- If `localStorage` is unavailable (private mode, locked webview), the game runs in memory and the
  player is warned that progress will not survive a reload.
- Import validates the app marker and runs the same repair pass. Export produces a readable JSON
  file with the marker, version, timestamp and save.

## 6. Rendering and art

- All game art is inline SVG built from content data (palette + shape). No sprite sheets, no image
  decode cost, crisp at every density, and each species can be recolored in one place.
- Scene decoration (stars, aurora, mist, fireflies) is CSS with `prefers-reduced-motion` support.
- Layout uses logical properties (`inset-inline-start`, `margin-inline`) so Arabic mirrors without a
  second stylesheet.
- Typography: Fraunces for display, Outfit for UI, locale-specific system stacks for Japanese and
  Arabic. Only the two Latin subsets are bundled; CJK/Arabic glyphs use the platform fonts.

## 7. Platform

- `vite-plugin-pwa` generates the manifest and Workbox service worker; all shell assets are
  precached so the game boots offline after first visit.
- `display: standalone`, portrait orientation, safe-area insets, `viewport-fit=cover`.
- Icons and maskable icon are generated by `scripts/generate-icons.mjs` from `public/icons/icon.svg`
  using `sharp` at build time (not at runtime).
- For app stores, the same `dist/` is wrapped by Capacitor. See
  [docs/ANDROID_PACKAGING.md](docs/ANDROID_PACKAGING.md).

## 8. Deliberate decisions

| Decision | Why |
| --- | --- |
| Web/PWA first, native wrapper later | One codebase, instant playable link, installable on both stores, no native toolchain needed to finish the game |
| Pure SVG art | Original, editable, tiny, resolution-independent; no licensing or download weight |
| Timestamp growth instead of tick counting | Correct offline growth and clock changes without background jobs |
| Typed dictionaries, no i18n library | Seven locales, compile-time key parity, zero bundle cost, full control of RTL |
| No analytics/ads in v1.0 | Privacy promise; store ad/billing SDKs need owner accounts and consent flows, so they are documented rather than faked |
| localStorage rather than IndexedDB | Save is < 20 KB; synchronous and simple; export/import mitigates platform eviction |
| Zustand rather than Redux | Tiny, no provider tree, selectors keep the 60 fps garden from re-rendering |
| One store, many pure functions | Testability; 50 tests run in under a second |
