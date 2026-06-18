import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // base: '/' works for both custom domains (spend.dukamax.com) and GitHub Pages
  // when a custom domain (CNAME) is configured on the Pages repo.
  // Do NOT change this to a repo-relative path — the CNAME makes root the origin.
  base: '/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'],

      manifest: {
        name: 'DukaMax PesaSafari',
        short_name: 'PesaSafari',
        description: 'Track Every Shilling — Offline-first shopping budget tracker by DukaMax',
        theme_color: '#6C63FF',
        background_color: '#0f0f1a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/?source=pwa',
        categories: ['finance', 'productivity', 'business'],
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },

      workbox: {
        // Pre-cache all build output
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff}'],

        // Critical for SPA: serve index.html for all navigation requests
        // so React Router handles client-side routing after SW takes over
        navigateFallback: '/index.html',

        // Don't intercept requests to the SW registration script itself
        navigateFallbackDenylist: [/^\/sw\.js$/, /^\/workbox-.*\.js$/],

        // Serve stale cached content immediately, update in background
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],

  build: {
    // Raise warning threshold — bundle includes Recharts + Framer Motion
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Split large vendor libs so the SW can cache them independently
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-charts': ['recharts'],
          'vendor-db': ['dexie']
        }
      }
    }
  }
})
