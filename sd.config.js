import StyleDictionary from 'style-dictionary'
import {
  SORB_RESOLVED,
  SORB_TOKENSET,
  SORB_VERSIONS,
  SORB_SET_META,
  sorbResolved,
  sorbTokenSet,
  sorbVersions,
  sorbSetMeta,
  SORB_MUI_VARS,
  sorbMuiVars,
} from '@sorb/seed'

StyleDictionary.registerParser(sorbSetMeta)
StyleDictionary.registerFormat({ name: SORB_RESOLVED, format: sorbResolved })
StyleDictionary.registerFormat({ name: SORB_TOKENSET, format: sorbTokenSet })
StyleDictionary.registerFormat({ name: SORB_VERSIONS, format: sorbVersions })

// `sorb/mui-vars` — PROMOTED to @sorb/seed 0.4.0 (T3). This demo now consumes
// the published format; `options.seedValues` supplies the MUI fallback
// literals this demo's own retired inline format used to hardcode (T8
// retrofit — see sorb-seed/src/emit/sorbMui.js for the format itself).
StyleDictionary.registerFormat({
  name: SORB_MUI_VARS,
  format: (args) =>
    sorbMuiVars({
      ...args,
      options: {
        ...(args.options || {}),
        seedValues: {
          'color.brand': '#1976d2',
          'color.brand-hover': '#1565c0',
          'color.brand-contrast': '#fff',
          'color.accent': '#9c27b0',
          'color.accent-hover': '#7b1fa2',
          'color.accent-contrast': '#fff',
          'color.danger': '#d32f2f',
          'color.danger-hover': '#c62828',
          'color.success': '#2e7d32',
          'color.success-hover': '#1b5e20',
          'color.surface': '#fff',
          'color.surface-raised': '#fff',
          'color.ink': 'rgba(0,0,0,0.87)',
          'color.ink-muted': 'rgba(0,0,0,0.6)',
          'color.border': 'rgba(0,0,0,0.12)',
          'radius.control': '4px',
        },
      },
    }),
})

/** @type {import('style-dictionary').Config} */
export default {
  source: [
    'node_modules/@metatoy/janes-jeans/tokens/primitive.json',
    'node_modules/@metatoy/janes-jeans/tokens/semantic.json',
    'node_modules/@metatoy/janes-jeans/tokens/component.json',
  ],
  parsers: [SORB_SET_META],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/tokens/generated/',
      files: [{ destination: 'variables.css', format: 'css/variables', options: { outputReferences: true } }],
    },
    js: {
      transformGroup: 'css',
      buildPath: 'src/tokens/generated/',
      files: [{ destination: 'tokens.js', format: SORB_TOKENSET }],
    },
    sorb: {
      transformGroup: 'css',
      buildPath: '.sorb/',
      files: [
        { destination: 'resolved.json', format: SORB_RESOLVED },
        { destination: 'versions.json', format: SORB_VERSIONS },
      ],
    },
    mui: {
      transformGroup: 'css',
      buildPath: 'src/tokens/generated/',
      files: [{ destination: 'mui-vars.css', format: 'sorb/mui-vars' }],
    },
  },
}
