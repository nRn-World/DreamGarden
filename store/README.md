# Store Assets

| File | Size | Purpose |
| --- | --- | --- |
| `feature-graphic.png` | 2048 × 1000 (displayed 1024 × 500) | Google Play feature graphic |
| `screenshots/00-onboarding.png` | 1290 × 2796 | Language selection, first launch |
| `screenshots/01-title.png` | 1290 × 2796 | Brand and return loop |
| `screenshots/02-garden.png` | 1290 × 2796 | Core gameplay |
| `screenshots/03-seeds.png` | 1290 × 2796 | Collection and shop |
| `screenshots/04-spirits.png` | 1290 × 2796 | Spirits and bonds |
| `screenshots/05-journal.png` | 1290 × 2796 | Story progression |
| `screenshots/06-story.png` | 1290 × 2796 | Writing and atmosphere |
| `screenshots/07-settings.png` | 1290 × 2796 | Languages and comfort |

The screenshots are 430 × 932 CSS px at 3× density — the App Store 6.7" size and valid for Play
(which accepts 320–3840 px). Resize to 1242 × 2688 for 6.5" slots with:

```bash
node -e "require('sharp')('store/screenshots/01-title.png').resize(1242,2688).toFile('store/screenshots/01-title-65.png')"
```

## Regenerate

1. Start the dev server: `bun run dev`
2. Run `bun run store:screenshots`
3. Review the output at full size; the capture uses a seeded, progressed save so the garden looks
   lived-in. Do not ship screenshots from a fresh, empty garden.

The feature graphic is composed separately from the title art. Update `docs/STORE_LISTING.md` if the
screenshot order or captions change.
