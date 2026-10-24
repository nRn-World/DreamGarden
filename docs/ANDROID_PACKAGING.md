# Android and iOS Packaging

The game is a static PWA. Capacitor wraps the same `dist/` in a native container, which is the
lowest-risk way to ship this codebase to Google Play and the App Store without rewriting the game.

No native project is committed. Generating it requires Android Studio/Xcode and the owner's
credentials, so it is an owner step. The web app is already installable as a PWA in the meantime.

## 1. Prerequisites

- JDK 21 and Android Studio (with the current stable Android SDK)
- Node 20+ / Bun
- For iOS: macOS, Xcode 16+, an Apple Developer account
- A Play Console account and an upload keystore (see [HUMAN_ACTIONS.md](../HUMAN_ACTIONS.md))

## 2. Generate the wrapper

```bash
bun add @capacitor/core @capacitor/android @capacitor/app
bun add -d @capacitor/cli
bunx cap init "Dream Garden" com.nrnworld.dreamgarden --web-dir=dist
bun run build
bunx cap add android
bunx cap sync android
bunx cap open android
```

App identity:

| Setting | Value |
| --- | --- |
| App name | Dream Garden |
| Application ID | `com.nrnworld.dreamgarden` |
| Version name | `1.0.0` |
| Version code | `1` |
| Min SDK | 24 or newer (Capacitor default) |
| Target SDK | The current Play requirement; check Play Console before each release |

## 3. Native configuration

### AndroidManifest.xml

- Portrait orientation for phones: `android:screenOrientation="portrait"` on the main activity.
- `android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"`.
- No unnecessary permissions. This build needs none beyond internet for the initial load; after the
  service worker caches the app, it runs offline.
- Allow cleartext only in debug if needed; production must be HTTPS.

### Back button

Install `@capacitor/app` and handle Android hardware back:

1. If a sheet is open → close it.
2. If not on the garden → go to the garden.
3. Otherwise → minimize/exit.

Prevent accidental exit from the garden without a confirmation only if you also provide a pause
menu. A cozy game should not trap the player.

### Safe areas and status bar

- The CSS already uses `env(safe-area-inset-*)`, `viewport-fit=cover` and `100dvh`.
- Use a dark status bar with light icons (`#07050f`).
- Set the navigation bar to the same colour, with gesture navigation if possible.
- Do not hide the status bar permanently on notched devices; the HUD sits below it.

### Icons and splash

- Adaptive icon foreground: `public/icons/icon-512.png` (safe zone already respected).
- Background: `#07050f`.
- Splash: centred icon on `#07050f`, 1–2 s maximum, no logo animation that delays input.
- Use Android Studio → **Image Asset** and **Splash Screen** tools, or `@capacitor/assets`.

### WebView

- Keep the WebView's default text zoom disabled, or respect the system font scale through the
  in-game **Larger text** setting.
- Ensure `localStorage` is persisted; Capacitor does this by default.
- Enable hardware acceleration (default) and test on a low-end device with 4 GB RAM.

## 4. Build and sign

1. Generate an upload keystore **outside** the repository.
2. In Android Studio: **Build → Generate Signed Bundle / APK → Android App Bundle**.
3. Store the `.aab`, mapping file and keystore backup securely.
4. Upload to an **internal testing** track first.
5. Run the Play pre-launch report on at least three devices, including a low-RAM one.
6. Fix crashes, ANRs and layout issues, then promote to closed testing.

```bash
# Optional command-line build
cd android
./gradlew bundleRelease
```

R8/shrinking is enabled by default in release; verify the WebView and JS bridge still work. Keep the
mapping file for every release.

## 5. iOS

```bash
bunx cap add ios
bunx cap sync ios
bunx cap open ios
```

- Set the bundle ID to `com.nrnworld.dreamgarden`.
- Set the display name to `Dream Garden`.
- Add app icons (1024 × 1024 marketing icon) and launch screen colour `#07050f`.
- Support only portrait on iPhone; allow all orientations on iPad only if the layout is verified.
- Test safe areas on a notched device, the home indicator, and the iOS "Reduce Motion" and "Larger
  Text" settings.
- Archive and upload through Xcode Organizer / Transporter.
- Fill in App Privacy: no data collected.

## 6. Optional ads and purchases

If you enable them, prefer a native billing abstraction:

- **Ads:** `@capacitor-community/admob`, initialized after UMP consent. Use test unit IDs in debug.
  Rewarded ads must be optional. No banners over the garden controls.
- **Purchases:** RevenueCat or native Play Billing / StoreKit. Implement restore, cancellation and
  refund handling. Entitlements must survive reload and reinstall (restore).
- **Privacy:** update `PRIVACY.md` and store forms before shipping these SDKs. A consent flow is
  mandatory in regulated regions.
- **Supporter pack:** the recommended first product is a one-time cosmetic + thank-you, not a
  subscription. See [MONETIZATION.md](MONETIZATION.md).

## 7. Store review risks specific to wrapped web apps

- Play's minimum-functionality policy: the app must be a real game, not a website link. This build
  is a complete offline game with original art and content.
- Do not show browser chrome, URL bars or "open in browser" prompts.
- Do not load remote content that changes the reviewed experience.
- Provide a privacy policy and accurate data-safety answers.
- Keep screenshots free of device frames that imply features the app does not have.
- If the app requests no permissions and shows no ads, say so in the listing.

## 8. Post-launch

- Keep the web and native versions in sync; ship the same content in both.
- Monitor ANRs/crashes for the first 72 hours.
- Back up the keystore in two independent places. Losing it blocks updates.
- Tag each release in git and archive the matching `dist/` + `.aab`/`.ipa`.
