import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // MapLibre GL alone is ~1 MB minified (~280 kB gzip); the app is a single map view.
    chunkSizeWarningLimit: 1500,
  },
})
