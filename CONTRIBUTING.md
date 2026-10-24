# Contributing

Thanks for caring about Dream Garden. The project is source-available for non-commercial
educational use only — read [LICENSE](LICENSE) before contributing. Contributions that end up in a
commercial release require written permission from the owner.

## Before you start

- Check existing issues and keep changes focused.
- For balance or content changes, explain the player-facing effect, not only the code change.
- Do not add network calls, trackers, ad SDKs or third-party UI frameworks without prior agreement.
- Never commit credentials, keystores or store IDs.

## Development

```bash
bun install
bun run dev
bun run typecheck
bun run test
```

Keep the domain layer pure. Rendering, storage and effects belong outside `src/game/engine.ts`.
New user-facing strings must be added to `src/i18n/en.ts` first, typed, and then translated in all
six other locales. Run the i18n tests to prove key and placeholder parity.

## Style

- TypeScript strict mode; no `any` without a comment explaining the boundary.
- Prefer small pure functions and explicit types.
- CSS uses logical properties (`inset-inline-start`, `margin-inline`) so RTL keeps working.
- Animations must respect `data-motion="reduced"` and `prefers-reduced-motion`.
- Keep touch targets at least 44×44 px.
- No hard-coded English in components.

## Commits and tests

- Write a clear sentence describing why the change exists.
- Include tests for balance math, save migration or untranslated strings.
- Do not weaken assertions to make a suite pass; fix the cause.
- Update CHANGELOG.md for player-visible changes.

## Content contributions

Original flowers, spirits, chapters and decorations are welcome. Provide name, description,
palette, shape, grow time, yield, unlock level and the strings in all seven languages. Art must be
original SVG built from the existing shape language — do not copy reference art.

## Reporting bugs

Include device, browser/OS version, language, steps to reproduce, expected vs actual, and whether
the save was imported or fresh. Screenshots help. Never attach a save containing personal notes.
