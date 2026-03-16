import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { version } = require('./package.json')

export default defineConfig({
  plugins: [tailwindcss(), react()],
  define: {
    __APP_VERSION__: JSON.stringify(version)
  },
  base: './',
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist'
  }
})
