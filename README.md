# sorb-demo-mui — Janes Jeans on MUI

Janes Jeans (a fictional denim e-commerce brand) rebuilt on **MUI (Material UI)
v6.5**, themed live from Figma via Sorb. This is Phase **P3** of
`spec/sorb/demo-sites-multistack.md` — see that spec (and
`spec/sorb/demo-repo-skeleton.md`) for the full multi-stack program.

Local dev: `npm install && npm run dev` (Vite, **port 5183**, host pinned to
`127.0.0.1` — 5173-5175 are contested by sibling demos on this machine, and a
background Vite can bind IPv6-only while the juice bridge binds 127.0.0.1,
breaking headless verify scripts) · bridge: `npm run sorb` (port 7783,
namespace `jj-mui`).

## MUI integration — what's themed, what isn't (EVIDENCE framing)

**MUI's `cssVariables: true` CSS-var coverage is partial — this section states
exactly what is live-themeable, not a blanket claim.**

### The spike finding that shaped the mechanism

`createTheme({ cssVariables: true, palette: { primary: { main: 'var(--x)' } } })`
**throws** (`MUI: Unsupported 'var(...)' color`) — MUI's palette augmentation
needs real color values to compute contrast/tonal variants, so Janes Jeans
tokens **cannot** be fed into `createTheme` as `var()` strings directly (unlike
the Tailwind target, which can reference vars natively). The mechanism here is
therefore an **indirection layer**:

1. `theme.js` seeds `createTheme` with real values — **read from the committed
   Janes Jeans token set** (`tokens.js`, built by `npm run tokens`), not
   hand-typed hex. MUI computes its own `--mui-*` custom properties from these.
2. A **local** Style Dictionary format, `sorb/mui-vars` (`sd.config.js`, not yet
   promoted to `@sorb/seed` — promotion-candidate, see below), emits a second,
   later-cascading `:root` stylesheet that **re-points each covered `--mui-*`
   var at the matching Janes Jeans var** via `var(--jj-token, <mui-fallback>)`.
3. `main.jsx` renders this override `<style>` tag as the last sibling in the
   provider tree (after `ThemeProvider`), so it wins the cascade tie (same
   `:root` specificity, later in document order).
4. The Sorb bridge's live preview writes JJ tokens (`--color-brand`, etc.) as
   **inline styles on `:root`** — inline always wins over any stylesheet rule,
   regardless of the indirection above, so a preview push cascades straight
   through: `--color-brand` (inline) → `--mui-palette-primary-main` (override
   rule) → every MUI component reading that var.

### Verified against `@mui/material` 6.5.0's actual output

- **Default `cssVarPrefix` IS `mui`** (e.g. `--mui-palette-primary-main`) —
  confirmed by inspecting `theme.vars` directly, not assumed.
- **COVERED (live-themeable)**: `palette.{primary,secondary,error,warning,info,
  success}.{main,dark,contrastText}`, `palette.background.{default,paper}`,
  `palette.text.{primary,secondary}`, `palette.divider`, `shape.borderRadius`,
  `shadows[0..24]` (not wired into the override yet — same mechanism would
  apply; scoped out of this pass since no component visibly used a raw
  `theme.shadows[n]` index).
- **NOT COVERED — stays JS-only, cannot live-re-theme**: `typography` (MUI v6
  does not expose `fontFamily`/`fontSize`/`fontWeight` per variant as CSS vars
  by default — verified: `theme.vars.typography` is `undefined`), the
  `spacing()` function, `transitions`, `zIndex`, `breakpoints`. A Figma push
  that only touches Janes Jeans color/radius tokens re-themes visibly; a push
  that (hypothetically) touched type scale would not, without a separate,
  larger MUI typography-variant mechanism this demo does not build.

### `expectPrefixes` — corrects the skeleton doc's speculative resolution

`spec/sorb/demo-repo-skeleton.md` §5 (Ambiguity #2 resolution) guessed
`expectPrefixes: ['mui-']`, reasoning that Janes Jeans tokens would be renamed
directly into `--mui-*` vars (mirroring how `sorb-demo`'s `--bs-*` alias layer
works). **That doesn't hold for MUI**: the spike above shows JJ tokens cannot
be fed to `createTheme` as `var()` refs, so there is no renaming step — JJ
tokens stay `--color-*`/`--radius-*`/etc., and a *separate* override layer maps
`--mui-*` at them. The bridge pushes JJ token names, not MUI's names, so the
vocabulary guard must watch the JJ prefixes:

```js
expectPrefixes: ['color-', 'radius-', 'button-', 'card-', 'badge-', 'input-', 'nav-', 'toast-']
```

This is the same category of fix Tailwind needed (skeleton Ambiguity #1) —
**recommend the skeleton doc's §5 resolution for #2 be corrected** to match
(flagged for the pod / techlead).

### `sorb/mui-vars` promotion candidate

The format lives in this repo's `sd.config.js` only (not `@sorb/seed`), per the
task brief ("seed 0.3.0 has none — do NOT touch sorb-seed"). It's a reasonable
promotion candidate once a second CSS-var-based target needing indirection
(vs. direct renaming) exists to validate the shape isn't MUI-specific.

## Live-preview proof (verified, headless)

`scripts/preview-proof.mjs`: `POST /preview` on the local bridge (7783) with a
flat `{ "color-brand": "#ff00aa", ... }` map (**keys without the leading `--`**
— confirmed against `sorb-leaf/src/apply.js`'s `root.style.setProperty(`--${key}`,
...)`), navigate the running app to `?preview=<id>`, assert the AppBar's
*computed* background color changed and no `previewMismatch` fired. **PASS** —
see `screenshots/live-preview-{before,after}.png` (after: magenta AppBar +
buttons, "Sorb preview active" banner visible).

One real bug found and fixed en route: the original `sorb/mui-vars` docblock
comment contained the literal substring `--color-*/--radius-*`, whose `*/`
prematurely closed the CSS `/* comment */`, corrupting the entire generated
stylesheet (0 parsed rules, silently no-op). Fixed by rewording the comment.
Worth a general lint note for any future Style-Dictionary format that emits
CSS comments containing token-id wildcards.

## Migration protocol

- `pre-sorb` tag: storefront on hardcoded MUI theme literals (`src/theme.js`
  had hand-typed hex/px, no Janes Jeans import).
- `sorb-seed adapt --mode report` → `.sorb/adapt-report.json`: **122 hardcoded
  sites scanned, 19 auto / 88 review / 15 unmapped.** Honest caveats:
  - **99 of 122 hits (81%) are false-scope** — `adapt` scanned
    `src/tokens/generated/tokens.js` and `theme.js`'s *previous* hardcoded
    values, i.e. it walked into a `.gitignore`d build artifact directory
    instead of stopping at component source. Worth flagging back to
    `sorb-seed` (exclude `src/tokens/generated/` and other build-output globs
    by default).
  - Of the remaining 23 real component-source hits, only **one** was a
    genuine, correctly-targeted "auto" match: `theme.js`'s `shape.borderRadius:
    8 → radius.control`. A second "auto" hit (`ProductDetailPage.jsx`
    `minWidth: 24 → space.600`) is a **coincidental numeric match**, not a
    real design-token candidate (it's a quantity-stepper's MUI `sx` width).
  - The **review**/**unmapped** buckets are dominated by MUI `sx`-prop
    spacing-scale integers (`gap: 1`, `gap: 4`, pixel dimensions like `width:
    56`) — `sorb-seed adapt` is a generic React/JSX AST codemod, not
    MUI-`sx`-aware, so it can't distinguish "hardcoded brand value" from
    "MUI spacing-scale unit" or "avatar pixel dimension." Running `--mode
    codemod --write` unreviewed on this repo would have been actively wrong.
  - **Decision: hand-migrated, did not run `adapt --mode codemod --write`.**
    The one thing that actually determines what's live-themeable — `theme.js`'s
    seed values — is now read from `tokens.js` (see `src/theme.js`). Component
    JSX already used MUI's semantic theme references (`color="primary"`,
    `sx={{ bgcolor: 'background.paper' }}`) rather than hardcoded hex, which is
    the *correct* MUI idiom and needed no migration — the "hardcoded defaults"
    in the pre-sorb tag were entirely in `theme.js`, not scattered through
    components.
- `sorb-migrated` tag: `src/theme.js` sources every palette/shape value from
  the committed Janes Jeans token set; visually identical to `pre-sorb` (same
  resolved values) but no longer hand-typed — see
  `screenshots/{pre-sorb,sorb-migrated}-{home,pdp}.png` for the (intentionally
  unchanged) before/after.

## Routes vs §C contract

All six routes implemented on real MUI widgets — no hand-rolled substitutes:

| Route | Status | Native MUI components used |
|---|---|---|
| `/` home | ✅ | `AppBar`, `Toolbar`, `Drawer`, product `Card` grid, `Chip` badges, footer grid |
| `/shop` | ✅ | `Checkbox`/`FormGroup` filters, `Slider` price range, `Select` sort, `Pagination` |
| `/product/:slug` | ✅ | image, `Chip` size selector, qty stepper (`IconButton`), `Tabs`, `Accordion`, `Snackbar`+`Alert` toast |
| `/cart` | ✅ | `Table`, qty steppers, `IconButton` remove, summary `Card`, empty state |
| `/checkout` | ✅ | `Stepper`, `TextField` + validation, `RadioGroup`, `Select` (region), `Dialog` confirm |
| `/account` | ✅ | `Tabs`, order-history `Table` (empty state), profile `TextField` form, `Avatar`+`Menu` |

Cart/checkout/account are client-state only (React context + `localStorage`) —
no backend, no payments, no real auth, per the parent spec's Non-goals.

## Not yet done in this pass

- **Storybook + `@sorb/storybook` + per-component stories + capture
  round-trip** (build-order step 6) — not built in this pass; `.storybook/`
  and `stories/` dirs exist but are empty. Flagging honestly rather than
  padding scope.
- **Acid-wash re-theme before/after screenshot pair** (build-order step 7) —
  not captured; the live-preview proof screenshots (magenta test push) cover
  the same *mechanism*, but the actual "Indigo Classic → Acid Wash" scripted
  moment using `tokens/variants/acid-wash.json` from the kit was not run.
- No Coolify/DNS/hosted-bridge work — out of scope per the task brief and the
  skeleton doc's §4 (founder-gated, not part of a build run).

## Hard rules

JavaScript only (no TypeScript). Node 20 + npm (never pnpm — this repo is
standalone, not part of the sorb pnpm workspace). Don't commit
`node_modules/`, `dist/`, `.sorb/`, `src/tokens/generated/`,
`storybook-static/`. Commit/push only when asked (this repo has not been
pushed anywhere — no remote configured).
