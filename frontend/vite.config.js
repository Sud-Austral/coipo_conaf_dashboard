import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Local: ./  |  GitHub Pages: /<repository>/
  base: process.env.VITE_BASE || './',
  plugins: [react(), tailwindcss()]
})
