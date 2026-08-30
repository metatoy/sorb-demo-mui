import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Port 5183 assigned by the pod lead (5173/5174/5175 are contested — other
  // sibling demos on this machine bind them first). host pinned to IPv4
  // (127.0.0.1) — a background Vite can bind IPv6-only ([::1]) while the
  // juice bridge binds 127.0.0.1, which breaks headless verify scripts that
  // assume the two speak the same loopback address.
  server: { port: 5183, host: '127.0.0.1', strictPort: true },
  preview: { port: 5183, host: '127.0.0.1', strictPort: true },
})
