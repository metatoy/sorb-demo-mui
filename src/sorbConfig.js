import { tokens } from './tokens/generated/tokens'

// Same env-driven contract as sorb-demo/sorb-demo-<target> skeleton (§2.4) —
// only namespace + expectPrefixes differ per target.
//
//   VITE_SORB_ORIGIN       bridge origin (default http://localhost:7783)
//   VITE_SORB_KEY          read-only publishable key (sorb_pk_…) — hosted only
//   VITE_SORB_PREVIEW      set to `on` to force-enable preview in a prod build
//   VITE_SORB_DEMO_ORIGIN  this demo app's own deployed origin (extra allowlist entry)

const env = import.meta.env

const origin = env.VITE_SORB_ORIGIN ?? 'http://localhost:7783'
const key = env.VITE_SORB_KEY || undefined
const previewEnabled =
  env.VITE_SORB_PREVIEW === 'on' || Boolean(key) || env.MODE !== 'production'

const isLocal = (o) => !o || /^https?:\/\/(localhost|127\.0\.0\.1|\[?::1\]?)(:|\/|$)/.test(o)
const allowedOrigins = [origin, env.VITE_SORB_DEMO_ORIGIN].filter((o) => !isLocal(o))

/** @type {import('@sorb/leaf').SorbConfig} */
export const sorbConfig = {
  namespace: 'jj-mui',
  tokens,
  preview: {
    enabled: previewEnabled,
    origin,
    key,
    allowedOrigins,
    pollInterval: 1500,
    // Verified against @mui/material 6.5.0's actual cssVariables:true output
    // (default cssVarPrefix IS "mui" — vars like --mui-palette-primary-main).
    // This guard watches the SOURCE vocabulary the preview pushes (--color-*/
    // --radius-*/--button-* JJ vars), not the --mui-* vars themselves, since
    // the bridge pushes JJ token ids, not MUI's internal var names — the
    // override layer (mui-vars.css) does the --mui-* indirection downstream.
    expectPrefixes: ['color-', 'radius-', 'button-', 'card-', 'badge-', 'input-', 'nav-', 'toast-'],
  },
}
