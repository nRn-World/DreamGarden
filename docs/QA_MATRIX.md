# QA Matrix

## Environment

| Item | Value |
| --- | --- |
| OS | Windows 11 |
| Browser | Google Chrome 155.0.8059.85 (headless via Playwright) |
| Runtime | Bun 1.4.3, Node 24.14.1 |
| Build | Vite 7.1 production build, service worker enabled |
| Date | 2026-10-24 |
| Automation | `scripts/qa.mjs` (25 checks), `bun run test` (50 tests) |

No physical Android or iOS device was available. Native wrapper and real-device performance remain
owner steps (see [HUMAN_ACTIONS.md](../HUMAN_ACTIONS.md)). Nothing below claims device testing that
did not happen.

## Automated browser checks

`node scripts/qa.mjs` against `bun run preview` — **25/25 passed**:

| # | Check | Result |
| --- | --- | --- |
| 1 | First launch shows the language picker | Pass |
| 2 | Seven language options are listed | Pass |
| 3 | Intro copy appears after language choice | Pass |
| 4 | Title screen appears after onboarding | Pass |
| 5 | Garden renders 12 beds (6 open) | Pass |
| 6 | Seed sheet opens from an empty bed | Pass |
| 7 | Planting a seed adds a plant to the bed | Pass |
| 8 | Settings sheet opens | Pass |
| 9 | Swedish applies immediately | Pass |
| 10 | Reduced motion setting applies | Pass |
| 11 | Large text applies (root 18 px) | Pass |
| 12 | Language persists across reload | Pass |
| 13 | No horizontal overflow at 390 px | Pass |
| 14 | No console errors in the fresh flow | Pass |
| 15 | Arabic sets `dir="rtl"` | Pass |
| 16 | Arabic sets `lang="ar"` | Pass |
| 17 | Arabic layout has no horizontal overflow | Pass |
| 18 | No console errors in Arabic | Pass |
| 19 | No horizontal overflow at 320 px | Pass |
| 20 | Tablet layout has no horizontal overflow | Pass |
| 21 | Tablet frame stays 540 px wide | Pass |
| 22 | Service worker is active | Pass |
| 23 | Keyboard focus stays inside the open sheet | Pass |
| 24 | Escape closes the sheet | Pass |
| 25 | Game boots offline after reload | Pass |

## Unit tests

`bun run test` — **50/50 passed**:

- Engine: new save shape, plot mapping, growth timing, watering, harvest gates, yield bonus,
  harmony sale multiplier, level/unlocks/stardust, spirit bonuses, bonding and cap, order
  generation and validation, next-goal priority.
- Save: round-trip, corruption repair, backup recovery, version marker, import rejection, settings,
  bounded numbers, order sanitisation, fresh fallback.
- i18n: key parity, non-empty values, placeholder parity, translated story chapters, expected
  scripts, runtime registration, interpolation, fallback, duration formatting, number formatting.

## Manual checks performed

| Area | Check | Result |
| --- | --- | --- |
| Title | Brand, level, chapter badge, daily gift dot, continue button | Pass |
| Title | Moon does not obscure body copy after reposition | Pass |
| Garden | 12 beds, three states, timers, progress bars, locked costs | Pass |
| Garden | Ripe pulse, watered timer, water dots | Pass |
| Garden | Decorations, three companions, fireflies, island composition | Pass |
| Seed shop | Locked rows, prices, affordability, plant action | Pass |
| Wishes | Fulfil order, inventory deduction, reward, order regeneration | Pass |
| Wishes | Missing-item chips and disabled action | Pass |
| Spirits | Bond bars, passives, invited state | Pass |
| Spirit sheet | Bond 5 complete state, offering disabled | Pass |
| Story | Chapter sheet, drop cap, chapter gift, next chapter | Pass |
| Settings | Language grid, sound/music/haptics, motion, text size, data actions | Pass |
| Settings | Export/import/reset controls present | Pass |
| RTL | Arabic onboarding and layout mirroring | Pass |
| Responsive | 320 × 700 language screen | Pass |
| Responsive | 1024 × 1366 tablet frame | Pass |
| Offline | Service-worker boot with network disabled | Pass |
| Visuals | Store screenshot set at 1290 × 2796 | Pass |

## Not tested (and why)

| Area | Status |
| --- | --- |
| Physical Android/iPhone | No device available. Required before store submission. |
| Native wrapper and hardware back button | Not generated; Capacitor steps documented. |
| TalkBack / VoiceOver | No screen reader run. Manual pass recommended. |
| Store billing and ads | Not integrated; no credentials. |
| Real low-end performance / battery | Only headless Chrome; measure on a mid-range Android. |
| Long-session memory (> 30 min) | Not measured. Rendering has no apparent leak path, but verify. |
| Native speaker proofread | Translations reviewed structurally, not by native speakers. |
| Clock-change and process-death recovery | Domain logic covered by tests; not exercised on device. |
| 200 % browser zoom | Large-text mode tested; full zoom audit pending. |

## Reproducing

```bash
bun install
bun run test
bun run build
bun run preview          # use the printed port
node scripts/qa.mjs      # set GARDEN_URL if the port is not 4174
node scripts/capture-store.mjs   # while `bun run dev` is running
```
