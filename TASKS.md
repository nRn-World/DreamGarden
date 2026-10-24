# Tasks

Status legend: **Done** = implemented and verified locally. **Owner** = requires a human with
credentials or legal authority. **Deferred** = intentionally out of v1.0.

## Foundation

- [x] Scaffold Vite + React + TypeScript project with strict compiler settings.
- [x] Design token system, typography, safe-area layout, app shell, bottom navigation.
- [x] PWA manifest, icons, service worker, offline shell.
- [x] Audio/haptics service with opt-in settings and browser fallbacks.

## Domain

- [x] Define domain types (plants, spirits, orders, plots, save).
- [x] Author 8 plants with shapes, palettes, grow times, yields and unlocks.
- [x] Author 6 spirits, passives, bond thresholds and offering rules.
- [x] Author 6 decorations and placement slots.
- [x] Author 6 story chapters and 12 achievements.
- [x] Level curve, XP, stardust, bed unlocks and harmony.
- [x] Growth, watering, boosts, harvest, offline growth.
- [x] Orders: generation, refresh, fulfilment, rewards.
- [x] Daily gift with streak, moonwell with free daily charges.
- [x] Save/repair/backup/import/export/reset.
- [x] Unit tests for engine, save and i18n (50 tests).

## Art and feel

- [x] Procedural flower art for 8 species × 4 stages.
- [x] Procedural spirit art with idle animation.
- [x] Island composition, cliff, waterfall, mist, fireflies, stars, aurora.
- [x] Decoration art for 6 objects.
- [x] Micro-interactions: ripe pulse, harvest burst, level-up overlay, toasts.
- [x] Reduced-motion mode that removes non-essential animation.

## Screens

- [x] Onboarding with welcome, language picker, three intro pages.
- [x] Title with continue, daily gift and settings.
- [x] Garden, HUD, next-goal banner, context hints.
- [x] Seed shop with locked rows and affordability.
- [x] Bed unlock sheet.
- [x] Plant detail sheet with water, boost, harvest and sacrifice.
- [x] Wish orders screen with deliver and refresh.
- [x] Basket with per-stack sell and sell all.
- [x] Spirits screen, bond bar, offerings and equip.
- [x] Journal: story, achievements, statistics, settings.
- [x] Credits and privacy sheets.
- [x] Tutorial sequence.
- [x] Level-up celebration.

## Localization

- [x] English source dictionary (255 keys) as typed source of truth.
- [x] Swedish, Turkish, Spanish, Arabic, French, Japanese complete dictionaries.
- [x] Language selector with native names and local flag SVGs.
- [x] RTL layout, mirrored icons/chevrons via logical properties.
- [x] Locale-aware number and duration formatting.
- [x] Key parity, placeholder parity, script and chapter-length tests.
- [ ] Native-speaker proofread of all six translations (owner/contractor).

## Release prep

- [x] README, plan, architecture, tasks, risks, acceptance criteria, human actions.
- [x] Privacy, third-party notices, contributing, security, changelog, release checklist.
- [x] Art bible, localization, accessibility, monetization, store listing, QA matrix.
- [x] Store screenshots and generated feature art.
- [x] Release report with actual commands and limitations.
- [ ] Native wrapper (Capacitor) and signed AAB/IPA — **Owner**.
- [ ] AdMob/UMP and billing SDK integration — **Owner** (needs account IDs).
- [ ] Store accounts, listings, content ratings, data-safety forms — **Owner**.
- [ ] Independent legal review of the custom license and privacy text — **Owner**.

## Deferred

- [ ] Cloud save and cross-device sync.
- [ ] Seasonal content and live events.
- [ ] Additional languages beyond the seven.
- [ ] Controller/gamepad navigation polish.
- [ ] Native share sheet and home-screen widgets.
