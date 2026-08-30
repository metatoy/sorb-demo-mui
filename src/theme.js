import { createTheme } from '@mui/material/styles'

// PRE-SORB state: hardcoded framework-native literals, no Janes Jeans tokens
// referenced anywhere in this file. This is the "BUILT on hardcoded defaults"
// baseline the migration protocol tags as `pre-sorb` (demo-sites-multistack.md
// §D migration protocol step 1) before `sorb-seed adapt` touches anything.
export const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: { main: '#24345c' },
    secondary: { main: '#e8632b' },
    error: { main: '#c23b2e' },
    success: { main: '#3e8e4f' },
    background: { default: '#ffffff', paper: '#f2ede3' },
    text: { primary: '#182440', secondary: '#6e5d45' },
    divider: '#d2c3a8',
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
  },
})
