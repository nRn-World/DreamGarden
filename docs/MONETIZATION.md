# Monetization Design

## Principle

Dream Garden must be worth playing before it asks for anything. The game is fully completable
without spending money and without watching an ad. Revenue is optional support, not a gate.

This repository contains **no ad or billing SDK**. That is deliberate: real integration requires the
owner's AdMob/app IDs, store products, consent configuration and signing keys. The design and the
integration points are ready; the credentials are not something an agent can invent.

## Recommended model for launch

### 1. Free, complete game (primary)

- All 12 beds, 8 flowers, 6 spirits, 6 chapters and 12 achievements available for free.
- No energy, no pay-to-skip timers, no loot boxes.
- This is the acquisition and review story: "a cozy game with no ads".
- Cost to the owner: static hosting (often free or a few dollars a month). No server.

### 2. Optional one-time supporter purchase — "Moonlit Supporter" (recommended first paid item)

- Price: **US$3.99 / 49 kr** (adjust per store price tier).
- Content: an exclusive **Starlight Arbor** decoration, a **Moonmoth** spirit skin, a supporter
  badge in Credits, and a one-time 50-stardust thank-you.
- Never blocks content. Purely cosmetic + convenience + thanks.
- Restore purchases supported. No subscription.
- This is the most honest first monetization for a premium-feeling indie game and has no ad SDK,
  no consent flow and no child-directed ad risk.

### 3. Cosmetic packs (later)

- Seasonal decoration packs at US$1.99, 3–5 items each, no gameplay advantage.
- Bundle two packs for US$2.99.
- Only after the base game has an audience and reviews; do not launch with a store full of DLC.

### 4. Optional rewarded ad (only if the owner insists)

- One optional "watch to finish this bloom now" per plant, never required, never auto-played.
- No interstitial on launch, harvest, level-up or story. No banners over controls.
- Requires UMP consent before any request, a privacy-options entry, and a child-directed decision.
- Expected revenue is low for a cozy niche game and the trust cost is high. Recommend deferring.

### 5. No ads for supporters

- If ads are ever added, the supporter purchase removes them permanently.
- Keep the removal entitlement checked locally and restored from the store receipt.

## What not to do

- No "pay to keep your streak", no wilting while away, no limited-time FOMO, no random rewards for
  money, no ads disguised as gifts, no fake countdowns.
- Do not ask for notifications before the player has finished the tutorial.
- Do not collect data for "personalization" in a game whose promise is privacy.

## Unit economics (planning estimates, not promises)

| Item | Assumption |
| --- | --- |
| Store fee | 15 % (small-business programs) to 30 % |
| Price | US$3.99 |
| Net per supporter | ~US$3.39 at 15 %, ~US$2.79 at 30 % |
| Conversion | 1–3 % of active players is a realistic healthy range for optional cosmetics |
| Example | 10,000 installs × 2 % × US$3.39 ≈ US$678 gross to owner, before tax |
| Ongoing cost | Static hosting and occasional updates; no servers |

The game can be profitable at small scale because it has no backend and no live-ops team. Growth
comes from store featuring, word of mouth and localization, not from pressure.

## Technical integration (when credentials exist)

Use a native wrapper (Capacitor) and a billing abstraction so the web build stays clean. The
following files are a plan, not part of this build:

```
src/services/billing.ts       interface BillingProvider { purchase, restore, entitlements }
src/services/billing.native.ts  RevenueCat or StoreKit/Play Billing implementation
src/components/SupporterSheet.tsx  UI, hidden while entitlements are unknown
```

- Keep product IDs in build-time config, not source.
- Verify purchases server-side only if you add a backend; otherwise rely on the store's signed
  receipt and RevenueCat.
- Grant entitlements idempotently and persist them in the save.
- Provide **Restore purchases** and a clear error state.
- Test sandbox purchases, cancellation, refunds, family sharing and offline launch.

For ads, use `@capacitor-community/admob`, initialize **after** UMP consent, and request only
rewarded inventory. Use Google's official test ad unit IDs in debug builds.

## Metrics to watch (only with consent)

- Supporter conversion and refund rate.
- Store page conversion (installs / page views).
- D1/D7 retention, which matters more than conversion at this scale.
- Review sentiment; a single "no ads, bought the supporter pack to say thanks" review is the goal.

## Owner checklist

See [HUMAN_ACTIONS.md](../HUMAN_ACTIONS.md) sections 3–4. Legal review of the license and privacy
policy is required before taking money.
