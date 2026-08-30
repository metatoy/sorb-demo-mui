import { createTheme } from '@mui/material/styles'
import { tokens } from './tokens/generated/tokens'

// SORB-MIGRATED state: seed literals are now READ from the committed Janes
// Jeans token set (tokens.js, built by `npm run tokens`) instead of hand-typed
// hex/px values. This is the "migrate to kit tokens" half of the protocol
// (demo-sites-multistack.md §D migration protocol step 4) — see git tags
// `pre-sorb` (hardcoded literals) vs `sorb-migrated` (this file) for the diff.
//
// Why the theme still needs real values, not var() refs: MUI's createTheme
// computes derived tones (hover/light/dark, contrast text) and REJECTS
// `var(...)` strings as palette input (verified via spike — see README §MUI
// integration). So build-time seeding stays literal; RUNTIME re-theming
// happens one layer down, via the mui-vars.css override (sd.config.js
// `sorb/mui-vars` format) that re-points MUI's generated `--mui-*` custom
// properties at the Janes Jeans `--color-*`/`--radius-*` vars, which the Sorb
// bridge DOES swap live. This file only has to stay in sync with the
// committed (non-preview) token set — the live-preview seam is downstream.
export const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: { main: tokens['color-brand'] },
    secondary: { main: tokens['color-accent'] },
    error: { main: tokens['color-danger'] },
    success: { main: tokens['color-success'] },
    background: { default: tokens['color-surface'], paper: tokens['color-surface-raised'] },
    text: { primary: tokens['color-ink'], secondary: tokens['color-ink-muted'] },
    divider: tokens['color-border'],
  },
  shape: { borderRadius: parseInt(tokens['radius-control'], 10) || 8 },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
  },
})
