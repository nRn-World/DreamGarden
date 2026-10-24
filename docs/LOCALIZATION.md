# Localization

## Languages

| Code | Language | Script | Direction | Flag | Notes |
| --- | --- | --- | --- | --- | --- |
| `en` | English | Latin | LTR | `gb.svg` | Source of truth and fallback |
| `sv` | Svenska | Latin | LTR | `se.svg` | Informal `du` |
| `tr` | Türkçe | Latin | LTR | `tr.svg` | Dotless/dotted i correctness |
| `es` | Español | Latin | LTR | `es.svg` | Neutral Spanish, `tú` |
| `ar` | العربية | Arabic | **RTL** | `sa.svg` | Modern Standard Arabic |
| `fr` | Français | Latin | LTR | `fr.svg` | `tu`/`toi` |
| `ja` | 日本語 | Japanese | LTR | `jp.svg` | です・ます UI, literary story |

English is always the fallback. The language selector shows the native name, the English name in a
smaller line, and the local flag SVG. A flag never replaces the language name; a language is not a
country.

## Source of truth

`src/i18n/en.ts` defines `Dictionary` with 255 stable keys. Every other file is typed as
`Dictionary`, so a missing or extra key fails `tsc`. Keys are grouped by feature and never renamed
without updating every locale.

Placeholders use `{name}` and `{count}`. They are substituted after locale-aware number formatting.
Never concatenate translated fragments into a sentence; add a complete message key instead.

## Runtime

- `dictionaries` maps locale → dictionary.
- `translate(locale, key, vars)` falls back to English, then to the key itself.
- `formatNumber` uses `Intl.NumberFormat`.
- `formatDuration` builds hours/minutes/seconds from translated unit keys, not English suffixes.
- `<html lang>` and `<html dir>` are set from the locale on boot and on change.
- The choice is persisted in the save and in settings; changing it never resets progress.

## RTL rules

- Use logical properties: `inset-inline-start`, `padding-inline`, `margin-inline`, `border-inline`.
- Mirror directional icons (chevrons, back arrows) with CSS under `[dir='rtl']`.
- Keep artwork (flowers, island, moon) unmirrored; only UI chrome mirrors.
- Progress bars fill from the inline start.
- Numbers, timestamps and Latin proper nouns can remain LTR inside RTL text; use `dir="auto"` where
  a value is inserted into a sentence.
- Arabic must not receive Latin letter-spacing.

## Japanese rules

- No spaces around punctuation; avoid line breaks before small kana where the browser allows
  `line-break: strict`.
- Use です・ます for interface copy and a restrained literary tone for story chapters.
- Keep plant and spirit proper names in Latin as brand names, as specified by the brief.

## Verification

Automated (`src/test/i18n.test.ts`):

- all six locales contain every English key exactly once;
- no empty values;
- every `{placeholder}` set matches English;
- each locale uses the expected script;
- story chapters are translated, not copied, and remain substantial;
- runtime interpolation, fallback and duration formatting work.

Manual before release:

- read every screen in every language at 320 px and 390 px;
- check that no button label wraps into an unreadable shape;
- check Arabic sheets, nav and dialogs for mirrored spacing;
- check Japanese line breaks in story text;
- have native speakers proofread tone and terminology.

## Adding a language

1. Add the code to `LocaleCode` and `LANGUAGES` with native name, English name, flag and direction.
2. Copy `en.ts` to the new locale and translate values only.
3. Add the flag SVG from a licensed public-domain source and record it in THIRD_PARTY_NOTICES.md.
4. Import the dictionary in `src/i18n/index.ts` and in the test file.
5. Add font-stack rules if the script needs them.
6. Run `bun run test` and `bun run typecheck`.
