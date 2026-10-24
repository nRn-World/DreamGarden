# Art Bible — Dream Garden

## 1. North star

A garden seen at the edge of sleep: deep indigo air, mint bioluminescence, flowers that look grown
rather than drawn. Everything is soft, hand-shaped and slightly imperfect. Nothing is sharp, glossy
or neon for its own sake.

The player is standing on a small floating island. The camera is fixed, slightly above eye level,
looking across the island to a large moon and an open sky. This fixed stage is the whole world;
depth comes from layers, light and mist rather than movement.

## 2. Shape language

| Element | Language |
| --- | --- |
| Flowers | Rounded bells, teardrop petals, faceted crystals, feathered ferns. No geometric primitives without organic distortion. |
| Leaves | One asymmetric leaf silhouette, reused at different scales and angles. Veins are a single curved stroke. |
| Spirits | Sphere + drooping ear/wing pair + two dot eyes. Each has one signature accent (dew drop, flame, star, petal, owl tuft, moon crescent). |
| Island | Hand-cut oval with a cliff underside. A thin mint rim-light separates the surface from the dark. |
| UI | Soft rounded rectangles, 17–24 px radii, 1 px translucent hairlines, frosted glass over the scene. |
| Icons | 1.5 px strokes, rounded caps, no fills except tiny accents. |

No triangles pointing at the player, no aggressive diagonals, no hard black outlines.

## 3. Palette

Core tokens live in `src/styles/tokens.css`.

| Token | Hex | Use |
| --- | --- | --- |
| `--bg` | `#07050f` | Deepest sky / page |
| `--ink` | `#f7f2ff` | Primary text |
| `--muted` | `#b7accd` | Secondary text |
| `--mint` | `#a9f0cf` | Growth, primary action, rim light |
| `--mint-strong` | `#7be3b4` | Hover / active primary |
| `--lav` | `#cbb6ff` | Dream magic, night flowers |
| `--rose` | `#ffb7d6` | Warm blooms, affection |
| `--gold` | `#ffd68f` | Ripe state, rewards, stardust |
| `--sky` | `#a9dcff` | Water, thirst, cool accents |
| `--danger` | `#ffa9a9` | Destructive confirmation only |

Per-flower palettes are data (`src/game/content/plants.ts`): petal, petalDeep, core, stem, leaf and
glow. A flower never uses more than five hues. Glow is always a lighter, desaturated version of the
core.

Rules:
- Mint means "alive / can act"; gold means "reward ready"; sky means "needs water"; lavender means
  "mystery / spirit".
- Never use colour alone: pair with icon, label, pulse or shape.
- Backgrounds stay below 30 % saturation; blooms are the only saturated elements.

## 4. Lighting

- Key light: large moon, upper right, cool cream (`#fff4d6`) with a soft halo.
- Fill: faint lavender bounce from the sky, never directional.
- Rim: mint edge on the island and on ripe flowers.
- Spirits and flowers carry their own small glow; the glow is a radial gradient at 10–30 % opacity,
  never a hard shadow.
- Shadows are violet-black, blurred 8–14 px, at 25–40 % opacity. No pure black.

## 5. Composition

- 8 px spacing scale; 12 px outer gutters on phones.
- HUD occupies the top 12 % and bottom 11 %; the island sits between them.
- The moon is always upper right, behind the HUD, never behind text.
- Beds form a 3 × 4 grid on a rounded board; the board is the visual anchor.
- Empty beds must read as inviting, not as holes: dashed plus, faint label, slightly lighter fill.
- One primary action per screen. Secondary actions are ghost buttons.
- Sheets rise from the bottom, max 86 vh, with a visible grab handle and a close button.

## 6. Motion

- Ambient: stars twinkle 4–9 s, aurora drifts 40 s, fireflies 5–9 s, mist 30 s.
- Plants sway 6.5 s with ±1° rotation; ripe plants pulse 3 s.
- Buttons spring 180 ms; sheets 320 ms cubic-bezier(0.22, 1, 0.36, 1).
- Reward moments: 400–700 ms burst, then settle. Never block input for more than 700 ms.
- Reduced motion: all ambient loops stop, plants do not sway, sheets fade instantly. State changes
  remain visible through colour/label changes.

## 7. Typography

- Display: **Fraunces** (soft serif, optical size), 300–600. Used for titles, plant names, chapter
  headings. Letter-spacing −0.02 em to −0.035 em at large sizes.
- UI/body: **Outfit** 300–600. 0.63–1 rem, line-height 1.45.
- Overline labels: 0.62 rem, 0.18 em tracking, uppercase, mint or muted.
- Japanese: Hiragino Mincho / Yu Mincho for display, Hiragino Sans / Yu Gothic for UI.
- Arabic: Noto Naskh Arabic / Geeza Pro for display, Noto Sans Arabic / Segoe UI for UI; no added
  letter-spacing.
- Minimum body size 12 px; 16 px for inputs; large-text mode raises root to 18 px.
- Numbers use tabular figures in HUD counters so values do not jitter.

## 8. Iconography

- 24 × 24 viewBox, 1.5 px stroke, round caps/joins.
- Icons: dew (droplet), stardust (four-point sparkle), leaf, water, basket, book, sparkle, moon,
  lock, plus, check, close, settings, chevron, gift, heart, sun, sound, motion, text, trash,
  download, upload, globe, info, music, flame.
- Chevrons mirror in RTL via `transform: scaleX(-1)` under `[dir='rtl']`.
- Icon-only buttons always carry `aria-label` and a visible focus ring.

## 9. Asset budgets

| Budget | Target |
| --- | --- |
| JS bundle (gzip) | < 200 KB (current ~147 KB) |
| CSS (gzip) | < 25 KB (current ~18 KB) |
| Fonts | 2 Latin woff2 subsets, < 120 KB total |
| Raster images | icons only; no gameplay textures |
| DOM nodes on garden | < 450 |
| Concurrent CSS animations | < 40, all transform/opacity |
| First paint | < 1.5 s on a mid-range phone over 4G |

## 10. Prohibited

- Copied reference art, traced screenshots, stock illustrations or AI-generated raster scenes.
- Emoji used as icons or flags.
- Drop shadows on text below 16 px, neon outlines, glassmorphism over busy art, or more than two
  accent hues in one component.
- Red/green as the only signal for ripe/thirsty.
- Decorative motion that cannot be turned off.
