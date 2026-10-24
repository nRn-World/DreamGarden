/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  // GitHub Pages serves project sites from /<repo>/. The deploy workflow sets
  // GITHUB_PAGES=true; local dev and preview stay at the domain root.
  const base = process.env.GITHUB_PAGES === 'true' ? '/DreamGarden/' : '/';

  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico',
          'og-cover.jpg',
          'fonts/*.woff2',
          'flags/*.svg',
          'icons/*.svg',
          'icons/*.png',
          'brand/*',
        ],
        manifest: {
          name: 'Dream Garden',
          short_name: 'Dream Garden',
          description:
            'Grow a magical night garden, befriend dream spirits and uncover a gentle mystery. By nRnWorld.',
          theme_color: '#0b0a1f',
          background_color: '#07050f',
          display: 'standalone',
          orientation: 'portrait',
          start_url: base,
          scope: base,
          categories: ['games', 'entertainment'],
          icons: [
            { src: `${base}icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
            { src: `${base}icons/icon-512.png`, sizes: '512x512', type: 'image/png' },
            { src: `${base}icons/icon-1024.png`, sizes: '1024x1024', type: 'image/png' },
            { src: `${base}icons/maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2,webmanifest}'],
          navigateFallback: 'index.html',
          cleanupOutdatedCaches: true,
        },
      }),
    ],
    server: { host: '127.0.0.1', port: 5173 },
    build: { target: 'es2020', assetsInlineLimit: 4096 },
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
  };
});
