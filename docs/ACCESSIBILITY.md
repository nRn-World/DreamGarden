# Accessibility

## Goals

The garden should be playable by someone using one hand, a screen reader, large text, reduced motion
or a low-end device. The game is calm by design; accessibility is part of that calm.

## Implemented

### Motion

- Settings → **Reduce motion** stops ambient loops, plant sway, fireflies and sheet transitions.
- The system `prefers-reduced-motion` preference is honoured on first load.
- No interaction depends on animation to communicate state.

### Text and contrast

- **Large text** raises the root font size to 18 px.
- Body text targets WCAG AA against its panel; secondary text is at least 4.5:1.
- State is never communicated by colour alone: ripe shows a label and a sparkle, thirsty shows a
  water icon and label, locked shows a lock and level.
- Numbers use tabular figures to avoid jitter.

### Targets and layout

- Primary buttons are 48–56 px tall; plot beds are at least 74 px tall.
- Bottom navigation items are at least 56 px tall with generous hit area.
- Layout works at 320 px, standard phones, tablets and landscape heights.
- Safe-area insets keep controls clear of notches and home indicators.
- Sheets are scrollable when content exceeds the viewport.

### Semantics

- Every interactive element is a `<button>` with an accessible name.
- Icon-only controls use `aria-label`; decorative art is `aria-hidden`.
- Sheets use `role="dialog"` and `aria-modal`, with a labelled heading.
- Toasts announce through a live region.
- Progress is expressed with text (time left, stage n/4, xp current/needed), not only bars.
- Focus-visible styling is present on all controls.

### Language

- The document language and direction update with the selected locale.
- Screen readers receive translated labels, not English fallbacks, for all shipped strings.
- Arabic uses logical layout and no letter-spacing.

## Keyboard

| Key | Action |
| --- | --- |
| Tab / Shift+Tab | Move through controls |
| Enter / Space | Activate |
| Escape | Close the active sheet or dialog |
| Tab | Cycles inside the open sheet |

## Known limitations

- Screen-reader output has not been verified with VoiceOver or TalkBack on a real device.
- No high-contrast theme.
- No gamepad/switch-control support beyond standard keyboard focus.
- Dynamic story text is not chunked for screen readers.

## Verification checklist

- [x] Reduced motion removes ambient animation.
- [x] Large text does not clip critical labels at 390 px.
- [x] Icon-only controls have names.
- [x] Sheets have dialog roles and labelled headings.
- [x] Keyboard reaches all main actions; Escape closes sheets.
- [x] Arabic is RTL and readable at 390 px.
- [x] Focus trap inside sheets; focus returns to the trigger on close.
- [ ] VoiceOver/TalkBack pass on device.
- [ ] Contrast audit with a tool for every text/background pair.
- [ ] 200 % browser zoom on tablet.
