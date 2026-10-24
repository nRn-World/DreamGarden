/**
 * Resolves a file in `public/` against Vite's base URL.
 * Keeps the game working both at `/` and under a GitHub Pages project path
 * such as `/DreamGarden/`.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
