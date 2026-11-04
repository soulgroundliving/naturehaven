import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Absolute base — relative './assets/…' breaks module resolution on nested
  // routes (/journal/<slug> would request /journal/assets/…). The site is
  // always served from the domain root on Vercel.
  base: '/',
  // inspectAttr stamps a code-path="src/…tsx:line:col" attribute on every
  // element for the editor's inspector — dev server only, or it ships source
  // paths and ~1,000 extra attributes in every prerendered page.
  plugins: [command === 'serve' && inspectAttr(), react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
