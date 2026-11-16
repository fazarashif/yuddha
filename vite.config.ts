import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Yuddha',
        short_name: 'Yuddha',
        description: 'Belajar catur lewat cerita, latihan, dan tanding.',
        lang: 'id',
        theme_color: '#0f1524',
        background_color: '#0f1524',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        globIgnores: ['engine/**', 'puzzles/**'],
        // The engine and puzzle bands are fetched on first use, then kept for offline play.
        runtimeCaching: [
          {
            urlPattern: /\/puzzles\//,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'puzzles', expiration: { maxEntries: 24 } },
          },
          {
            urlPattern: /\/engine\//,
            handler: 'CacheFirst',
            options: { cacheName: 'engine', expiration: { maxEntries: 4 } },
          },
        ],
        navigateFallback: '/index.html',
      },
    }),
  ],
  test: { environment: 'node' },
});
