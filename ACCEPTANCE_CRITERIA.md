# Acceptance Criteria

## First launch (fresh install)

- [x] First screen shows the game name, studio credit and a language selector with all seven
      languages in their own script plus a flag, without emoji.
- [x] No permission prompt, no account, no network request, no consent wall before play.
- [x] Onboarding can be skipped; the intro never repeats after completion.
- [ ] A new player can plant their first seed in under 30 seconds from first tap (flow is short; not stopwatch-tested).
- [x] Tutorial highlights plant → water → harvest → sell/deliver, and is dismissible.
- [x] Returning player goes straight to the title, then the garden.
- [x] If the previous save was repaired or lost, a clear, non-scary message explains what happened.

## Core gameplay

- [x] Every bed shows empty, growing, thirsty, ripe or locked state without relying on colour alone.
- [x] Growth continues while the app is closed; the elapsed time is reported on return.
- [x] Watering reduces remaining time and increases yield, with no way to waste water on a ripe plant.
- [x] Harvest adds the correct yield, XP and possible stardust; a dry plant cannot be harvested.
- [x] Selling and wish fulfilment apply the harmony multiplier consistently.
- [x] Orders only ask for plants the player can unlock and always reward positive value.
- [x] Beds unlock at the documented level and cost; insufficient dew shows a disabled action.
- [x] Spirits bond through offerings, cap at bond 5, and their passive applies immediately.
- [x] Chapter unlocks require the documented level; finishing a chapter grants its reward once.
- [x] Achievements unlock exactly once and appear in the journal.
- [x] Daily gift can be claimed once per 20 hours; streak grows and resets sensibly.
- [x] Moonwell grants three free boosts per local day, then costs stardust.
- [x] No dead ends: every screen has a reachable back/close, including sheets and onboarding.

## Persistence

- [x] Reload restores garden, inventory, currency, level, story, achievements, settings and decor.
- [x] A corrupted primary save falls back to the backup.
- [x] A hand-edited save cannot produce NaN, negative currency or impossible unlocks.
- [x] Private mode (no localStorage) still lets the player play, with a warning.
- [x] Export produces a JSON file; import accepts only this app's marker and repairs fields.
- [x] Reset requires explicit confirmation and restores a fresh garden.
- [x] Language and comfort settings survive save import/export and reload.

## Localization and accessibility

- [x] All user-facing strings come from the dictionary; no visible hard-coded English outside
      proper nouns and debug output.
- [x] All seven locales have identical keys and placeholders.
- [x] Arabic switches the document to `dir="rtl"` and the layout mirrors correctly.
- [x] Numbers and durations are formatted per locale.
- [x] Language can be changed at first launch and later from Settings, without progress loss.
- [x] Reduced motion stops ambient and decorative animation.
- [x] Large text setting enlarges the UI without clipping critical labels.
- [ ] Interactive targets are at least 44×44 CSS px where space permits (not measured with an audit tool).
- [x] State is conveyed by icon/text as well as colour (ripe, thirsty, locked).
- [x] Every icon-only control has an accessible name; sheets are labelled dialogs.
- [x] Keyboard: Tab reaches all controls, focus stays inside an open sheet, and Escape closes it.

## Platform and offline

- [x] Production build succeeds and is served from `dist/`.
- [x] Manifest is valid, icons include 192, 512 and maskable.
- [x] Service worker precaches the shell; the game boots offline after the first visit.
- [x] Layouts work at 320 px wide, standard phones, and tablet widths.
- [ ] Safe-area insets respected on notched devices (CSS implemented; needs a real-device check).
- [x] No console errors during the verified flows.
- [x] Bundle under 600 KB JS gzip target (actual: ~147 KB gzip).

## Release gate

- [x] Typecheck clean.
- [x] All automated tests pass.
- [x] Production build clean.
- [x] Documentation set complete.
- [x] Licensing and privacy documents present.
- [x] No secrets, tokens or credentials in the repository.
- [ ] Signed store binaries produced — owner.
- [ ] Store review passed — owner.
- [ ] Native-speaker translation proofread — owner.
