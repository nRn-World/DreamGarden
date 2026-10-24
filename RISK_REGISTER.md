# Risk Register

| # | Risk | Likelihood | Impact | Mitigation / status |
| --- | --- | --- | --- | --- |
| R1 | Store rejection for a web-wrapped app ("minimum functionality" / low-quality policy) | Medium | High | Release as a genuinely complete game, not a website shortcut; native wrapper with splash, icons, offline, back handling, no browser chrome; follow Play's "spam and minimum functionality" policy. Owner must review before submission. |
| R2 | No ads or billing integrated yet, so no revenue on day one | Certain | Medium | Revenue design is documented and deliberately optional; the game is complete and reviewable without monetization. Owner adds store billing/AdMob with real IDs. |
| R3 | Owner has no Play/Apple developer accounts or signing keys | Certain | High | HUMAN_ACTIONS.md lists exact steps and costs. Nothing here can be completed by an agent. |
| R4 | Custom license is not legal advice; could be unenforceable or conflict with store terms | Medium | Medium | Source is source-available only; owner should obtain legal review. Store binaries are governed by the store EULA, not this file. |
| R5 | Translation errors or awkward tone in six locales | Medium | Medium | Typed key/placeholder parity tests and script checks pass; chapters are translated, not copied. Still requires native proofread before release (open item). |
| R6 | Arabic RTL layout defects on small phones | Medium | Medium | Logical CSS properties, RTL document direction, visual check in Arabic at 390 px. Needs a native Arabic layout review before release. |
| R7 | Saves evicted by the browser or OS, especially iOS Safari | Medium | High | Rolling backup, repair-on-load, export/import, in-memory fallback warning. Native wrapper reduces eviction risk. Cloud save is deferred. |
| R8 | Device clock changes let players skip growth or duplicate daily gifts | Medium | Low | Growth is computed from timestamps and clamped; daily gift uses local date + 20 h cooldown; moonwell keys on local date. A determined cheater only hurts their own pacing. |
| R9 | Performance on low-end phones (300+ animated nodes) | Low | Medium | Mostly CSS transforms and small SVG; no per-frame React state; reduced motion. Test on a real mid-range Android before release. |
| R10 | Accessibility gaps (screen reader order, focus trap) | Medium | Medium | Semantic buttons, labels, dialog roles, Escape handling, focus styles. Manual screen-reader pass is still recommended. |
| R11 | PWA install/offline differences across browsers | Medium | Medium | Workbox precache, navigate fallback, tested in Chromium. Native wrapper removes browser variance. |
| R12 | Fonts lack Arabic/Japanese glyphs in the bundle | Certain | Low | Locale-specific system font stacks are used; CJK/Arabic fall back to platform fonts. No tofu observed on tested devices, but glyph coverage varies by device. Bundling Noto subsets is a future improvement. |
| R13 | Scope creep into live ops before launch | Medium | Medium | v1.0 is content-complete and static; seasonal content explicitly deferred. |
| R14 | Underage audience and privacy/store declarations | Medium | High | No ads, no analytics, no accounts, no data collection. Store content rating and "data safety" answers must still be completed truthfully by the owner. If ads are added later, a child-directed decision and consent flow become mandatory. |
| R15 | Screenshots or store copy drift from the shipping build | Medium | Low | Store copy and screenshots are generated from this build; regenerate after any visual change. |
| R16 | License conflict with third-party asset terms | Low | Medium | Third-party fonts, flags and libraries retain their licenses; see THIRD_PARTY_NOTICES.md. No copyrighted reference art was copied. |
| R17 | Agent claims unverified release steps | Low | High | RELEASE_REPORT.md separates verified local results from owner-only steps; no store publication is claimed. |
