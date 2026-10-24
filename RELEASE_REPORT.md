# Release Report — Dream Garden 1.0.0

**Date:** 24 October 2026
**Publisher:** nRnWorld — bynrnworld@gmail.com
**Application ID:** `com.nrnworld.dreamgarden`
**Release type:** Web/PWA release candidate; native store packages not produced
**License:** Source-available, non-commercial educational use (see [LICENSE](LICENSE))

## 1. What was delivered

A complete, offline-first cozy garden game:

- onboarding with a seven-language picker and three intro scenes
- title screen, garden, seed shop, wishes, spirits, journal, story, settings
- 12 beds, 8 procedural flowers, 6 spirits, 6 decorations, 6 story chapters, 12 achievements
- daily night gift, moonwell boosts, wish orders, basket, XP/levels, harmony
- full translations for English, Swedish, Turkish, Spanish, Arabic (RTL), French and Japanese
- installable PWA with generated icons, maskable icon, splash-ready artwork and offline cache
- versioned save with repair, backup recovery, export/import/reset
- reduced motion, large text, sound/haptics toggles, focus-trapped sheets
- documentation, license, privacy policy, store copy, eight screenshots and a feature graphic

## 2. Verification environment

| Item | Value |
| --- | --- |
| OS | Windows 11 |
| Runtime | Bun 1.4.3, Node 24.14.1 |
| TypeScript | 5.9.2, strict, `tsc --noEmit` |
| Test runner | Vitest 4.1.12 |
| Browser | Google Chrome 155.0.8059.85 (headless via Playwright) |
| Build tool | Vite 7.1.3, vite-plugin-pwa 2.0.0 |
| Dev server | <http://127.0.0.1:5173> |
| Preview server | <http://127.0.0.1:4174> (4173 was occupied by another project) |

No physical Android or iOS device was used. No store submission, ad network, billing provider or
production database was contacted.

## 3. Commands and results

```text
$ ./node_modules/.bin/tsc --noEmit
(no output; exit 0)

$ bun run test
Test Files  3 passed (3)
Tests       50 passed (50)
Duration    ~1.1 s

$ bun run build
dist/assets/index-B_K2LDAq.css   83.96 kB │ gzip: 17.72 kB
dist/assets/index-FEssaEMu.js   499.88 kB │ gzip: 147.54 kB
PWA v2.0.0  generateSW  precache 36 entries (980.76 KiB)
dist/sw.js and dist/workbox-*.js generated
```

Build total: **1.1 MB** uncompressed including icons, flags and fonts. JavaScript is **147.54 kB gzip**.

## 4. Automated browser QA

`node scripts/qa.mjs` against the production preview — **25/25 checks passed**:

1. First launch shows the language picker
2. Seven language options are listed
3. Intro copy appears after language choice
4. Title screen appears after onboarding
5. Garden renders 12 beds
6. Seed sheet opens from an empty bed
7. Planting a seed adds a plant to the bed
8. Settings sheet opens
9. Swedish applies immediately
10. Reduced motion setting applies
11. Large text applies (root 18 px)
12. Keyboard focus stays inside the open sheet
13. Escape closes the sheet
14. Language persists across reload
15. No horizontal overflow at 390 px
16. No console errors in the fresh flow
17. Arabic sets `dir="rtl"`
18. Arabic sets `lang="ar"`
19. Arabic layout has no horizontal overflow
20. No console errors in Arabic
21. No horizontal overflow at 320 px
22. Tablet layout has no horizontal overflow
23. Tablet frame stays 540 px wide
24. Service worker is active
25. Game boots offline after reload

## 5. Manual verification

- Tapped through the full first-run flow at 390 × 844.
- Planted Dewbell through the real seed sheet; growth timer and stage sprite appeared.
- Fulfilled a wish order: inventory deducted, dew/stardust awarded, a new order generated.
- Opened a spirit sheet at bond 5; "Bond complete" state and disabled offering shown.
- Read Chapter 1; drop cap, chapter gift and "Next chapter" rendered correctly.
- Opened settings; switched to Swedish; toggled motion and text size.
- Checked Arabic onboarding at 390 px; layout mirrored, text right-aligned, no overflow.
- Checked 320 × 700 and 1024 × 1366 layouts.
- Verified service-worker boot with the network disabled.
- Reviewed all eight store screenshots at 1290 × 2796.

## 6. Evidence

- `store/screenshots/` — onboarding, title, garden, seeds, spirits, journal, story, settings
- `store/feature-graphic.png` — 1024 × 500 Play feature graphic
- `docs/QA_MATRIX.md` — matrix and untested areas
- `.tmp/qa-*.png` — local QA captures (not shipped)
- `RELEASE_REPORT.md` — this file

## 7. Defects found and fixed during QA

| Issue | Fix |
| --- | --- |
| Corrupt save with `orders: []` skipped order regeneration, leaving no wishes | Empty order arrays now regenerate |
| Unit tests assumed a different XP curve and goal priority | Tests corrected to match real rules |
| Title moon overlapped body copy, reducing legibility | Moon moved below the copy; text shadow added |
| Seed-stage sprite was tiny and hard to read | Sprout enlarged and raised |
| Sheets let Tab escape into the background | Focus trap, body scroll lock and focus restoration added |
| Empty bed labels were low contrast | Label and plus contrast raised |

## 8. Limitations and remaining work

These are real gaps; they are not hidden:

1. **No native packages.** Capacitor packaging and signing steps are documented but require the
   owner's Android Studio/Xcode, keystore and store accounts.
2. **No ads, analytics or in-app purchases.** The privacy promise depends on this for 1.0. If
   monetization is added, privacy/store disclosures must be updated and consent implemented.
3. **No native-speaker proofread.** All six translations are complete and structurally tested, but
   tone and terminology need a human pass.
4. **No real-device testing.** Performance, battery, TalkBack/VoiceOver and iOS safe areas remain
   unverified on hardware.
5. **Arabic and Japanese use system fonts.** The Latin display/UI fonts are bundled; CJK/Arabic
   glyph coverage depends on the device.
6. **Tablet experience is a centered 540 px phone frame**, not a redesigned tablet layout. It is
   readable and overflow-free, but not optimized for large screens.
7. **No cloud save.** Local storage can be evicted by aggressive browsers; export/import is the
   mitigation.
8. **Store assets need localized variants** for all seven languages before global submission.
9. **Legal review pending** for the custom license and privacy text.

## 9. Human-only release steps

See [HUMAN_ACTIONS.md](HUMAN_ACTIONS.md) for the complete list. The short version:

1. Create Play Console and Apple Developer accounts.
2. Generate and back up the Android upload keystore.
3. Wrap `dist/` with Capacitor, test on real devices, build a signed AAB/IPA.
4. Complete store listings, content rating and data-safety forms.
5. Host the privacy policy at a public URL.
6. Add native-speaker proofreading.
7. Only then publish, first to internal/closed testing.

## 10. Privacy and security posture

- No network requests at runtime after the app shell is cached.
- No analytics, ads, cookies, fingerprints, accounts or third-party scripts.
- Save data stays in `localStorage` and is exportable/erasable by the player.
- No secrets or credentials exist in the repository.
- `bun audit` was run after upgrading Vitest: **no vulnerabilities found** (450 packages).

## 11. Conclusion

The web/PWA build is **release-candidate complete and verified locally**. It is not a published
store release. Native packaging, store review, ad/billing integration and legal review remain owner
actions, and no claim is made that those steps occurred.
