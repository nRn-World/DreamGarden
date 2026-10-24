# Release Checklist

Use this for every store release. Check items only when the evidence is real.

## Code and build

- [ ] `git status` clean; no secrets, keystores or `.env` files staged.
- [ ] `bun install --frozen-lockfile` succeeds on a clean clone.
- [ ] `bun run typecheck` passes.
- [ ] `bun run test` passes.
- [ ] `bun run build` succeeds with no warnings.
- [ ] `dist/` loads over HTTP and works offline after the first load.
- [ ] Version bumped in `package.json`, PWA manifest and store metadata.

## Game

- [ ] Fresh install → onboarding → first plant → first harvest works.
- [ ] Existing save loads; backup recovery tested by corrupting the primary save.
- [ ] All seven languages render without clipping or missing glyphs.
- [ ] Arabic is RTL throughout, including sheets and nav.
- [ ] Story can be completed to Chapter 6; ending and credits are reachable.
- [ ] Daily gift and moonwell behave correctly across a local midnight.
- [ ] Offline return reports elapsed growth accurately.
- [ ] Reduced motion and large text do not break layout.
- [ ] No console errors, warnings or failed requests in a 10-minute session.
- [ ] Tested at 320 px, 390 px, 430 px and tablet width.

## Assets

- [ ] App icon (512), adaptive icon layers, maskable icon, splash screen.
- [ ] Feature graphic 1024×500 (Play) and 1290×2796 screenshots (App Store).
- [ ] Screenshots in all required languages (at least English + target markets).
- [ ] Store description, short description, keywords and What's New text.
- [ ] Content rating questionnaire completed.
- [ ] Data safety / App Privacy form completed and matches PRIVACY.md.
- [ ] Privacy policy URL live and reachable.

## Monetization (if enabled)

- [ ] UMP consent collected before any ad request.
- [ ] Test ads only in debug; production IDs externalized.
- [ ] Interstitials capped (no more than one per natural break, never mid-action).
- [ ] Rewarded ads optional, skippable, and never the only way to progress.
- [ ] Billing products created, prices localized, restore purchases tested.
- [ ] Purchase cancellations and refunds handled gracefully.
- [ ] Ads/billing disclosures added to privacy policy and store forms.
- [ ] No ad or purchase UI appears for users who are not permitted to see it.

## Store

- [ ] Internal testing track installed from the store (not sideloaded).
- [ ] Pre-launch report clean.
- [ ] Closed test with at least 12 testers for 14 days if required by a new personal Play account.
- [ ] Screenshots and copy proofread in every locale.
- [ ] Support email and privacy URL reachable.
- [ ] Rollout staged (10 % → 50 % → 100 %) with crash monitoring.

## Post-release

- [ ] Tag the commit and archive source + signed binaries.
- [ ] Keep upload keystore backed up in two places.
- [ ] Monitor reviews, crashes and refunds for the first 72 hours.
- [ ] Update CHANGELOG.md with the released version.
