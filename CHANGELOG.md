# Changelog

All notable changes to Dream Garden are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions use semantic versioning.

## [1.0.0] — 2026-10-24

First complete release candidate.

### Added

- Six-chapter story campaign with an ending and credits.
- 12 garden beds, 8 procedural flowers with four growth stages, watering and dream boosts.
- 6 spirits with bond levels, offerings and equippable passives.
- 6 decorations, wish orders, sell-all basket, daily night gift and Moonwell boosts.
- Onboarding, language picker, tutorial, next-goal guidance and level-up celebration.
- 7 languages: English, Swedish, Turkish, Spanish, Arabic (RTL), French, Japanese.
- Versioned save with repair, backup recovery, import/export and reset.
- Installable offline PWA with generated icons, maskable icon and splash artwork.
- Settings for language, sound, haptics, reduced motion and large text.
- Domain, save and localization test suites (50 tests).

### Known limitations

- No native store packages are committed; Capacitor packaging is documented.
- No ads, analytics or in-app purchases are integrated in this build.
- Arabic and Japanese use system fonts rather than bundled CJK/Arabic font subsets.
- Translations need a native-speaker proofread before public release.
- Cloud save and cross-device sync are not available.
