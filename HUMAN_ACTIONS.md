# Human-Only Actions

Everything below needs a person with legal identity, payment details, credentials or signing keys.
An agent cannot complete these, and this repository does not pretend they are done.

## 1. Accounts and identity

1. **Google Play Console** — create a developer account at
   <https://play.google.com/console/signup>. One-time fee (currently US$25). Identity verification
   can take a few days.
2. **Apple Developer Program** — enroll at <https://developer.apple.com/programs/> (currently
   US$99/year). Requires an Apple ID with two-factor authentication.
3. Decide the publisher name: `nRnWorld` and contact `bynrnworld@gmail.com`.

## 2. Signing and build

4. Generate an Android upload keystore and store it outside the repository. Never commit it.
   ```bash
   keytool -genkeypair -v -keystore dreamgarden-upload.jks -alias upload \
     -keyalg RSA -keysize 4096 -validity 10000
   ```
   Keep the keystore and passwords in a password manager and a second offline backup. Losing the
   upload key blocks updates (Play App Signing can help if enrolled from the start).
5. For iOS, create the distribution certificate and provisioning profile in the Apple Developer
   portal or let Xcode manage them.
6. Build the native wrapper (see [docs/ANDROID_PACKAGING.md](docs/ANDROID_PACKAGING.md)) and test on
   at least one real low/mid-range Android phone and one iPhone.
7. Run the Play pre-launch report and fix any crashes it finds.

## 3. Store listings

8. Write/approve the final store description, keywords and screenshots. Drafts are in
   [docs/STORE_LISTING.md](docs/STORE_LISTING.md), with images in `store/`.
9. Complete the **Data safety** form (Play) and **App Privacy** answers (App Store). For this build
   the honest answer is: no data collected, no data shared, no tracking. If ads, billing or
   analytics are added, update these answers before shipping.
10. Complete the content rating questionnaire (IARC). The game has no violence, gambling, user
    chat or purchases in this build; answer truthfully.
11. Set the target audience. Recommended: 13+ / not child-directed, because the game is not designed
    around COPPA/GDPR-K requirements. If you choose to target children, additional rules apply.
12. Provide the privacy policy URL. [PRIVACY.md](PRIVACY.md) is the source text; host it publicly.
13. Upload `app-ads.txt` to the domain listed on the store page if ads are added later.

## 4. Monetization (only if you choose to enable it)

14. Create an **AdMob** account, an app, and ad units. Use Google's official **test** IDs during
    development; production IDs go into environment-specific config, never the repository.
15. Install a UMP consent flow **before** requesting any ad. Do not request ads when consent is
    unknown or denied. Provide a "Privacy options" entry when required.
16. Create in-app products for the optional supporter pack and remove-ads entitlement in Play
    Console / App Store Connect. Wire them through RevenueCat or the platform billing libraries.
17. Have the purchase flow reviewed for refunds, restore purchases and parental controls.
18. Update PRIVACY.md and the store data-safety forms for the ad/billing SDKs before release.

## 5. Legal and business

19. Have a lawyer review the custom [LICENSE](LICENSE) and the privacy text. The license is
    source-available, not OSI open source, and this document is not legal advice.
20. Confirm you own or have licensed every asset. Flags are public domain; fonts are SIL OFL;
    libraries are MIT. No reference art from the brief was copied.
21. Set up a business entity, tax information and payout account with Google/Apple as needed.
22. Register the game name and check for trademark conflicts in your target markets.

## 6. Final release

23. Tag the release in git, archive the source, and keep the signed binaries.
24. Publish to an internal testing track first, then closed testing, then production.
25. After publication, monitor reviews and crash reports, and keep the privacy policy reachable
    from the store listing.
