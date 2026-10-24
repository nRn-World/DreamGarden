# Security Policy

Dream Garden is a static, offline game with no backend, no accounts and no collection of personal
data. That removes most server-side risk, but reports are still welcome.

## Supported versions

| Version | Supported |
| --- | --- |
| 1.0.x | Yes |
| < 1.0 | No |

## Reporting a vulnerability

Email **bynrnworld@gmail.com** with:

- a description of the issue and its impact;
- steps to reproduce or a proof of concept;
- affected version, browser/OS and language;
- whether a save file is involved (never include personal notes).

Please do not open a public issue before a fix is available. Expect an acknowledgement within a few
days. This is a small independent project; there is no bug bounty.

## In scope

- Cross-site scripting through save import, custom names or translations.
- Service-worker cache poisoning or stale privileged content.
- Save data that can crash the game, cause NaN, or bypass progression integrity in a harmful way.
- Any unexpected network request, tracker or secret exposure.
- Dependency vulnerabilities in the shipped bundle.

## Out of scope

- Cheating with a locally edited save (single-player, no economy server).
- Device clock manipulation for daily gifts.
- Missing certificate pinning (no network requests are made).
- Issues that require an already-compromised device or browser.

## Handling

Fixes are developed privately, verified with the full test suite, and released with a changelog
entry. Credit is given on request.
