import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: { port: 3000 },
  // nitro() produces the deployable server build. On Vercel it auto-detects
  // VERCEL=1 and emits the Build Output API (.vercel/output); locally it
  // produces .output/server/index.mjs (run via `npm start`).
  plugins: [tsconfigPaths(), tailwindcss(), tanstackStart(), nitro(), viteReact()],
})
