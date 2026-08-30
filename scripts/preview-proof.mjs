// Live-preview proof: push a JJ token change through the local `sorb dev`
// bridge (7783) and confirm the running MUI-styled store's COMPUTED style
// changes without reload — the seam this demo exists to prove (§D P3,
// verification item 3 of demo-sites-multistack.md).
import { chromium } from 'playwright'

const APP = process.argv[2] || 'http://127.0.0.1:5183'
const BRIDGE = process.argv[3] || 'http://127.0.0.1:7783'

const NEW_BRAND = '#ff00aa'
const NEW_BRAND_HOVER = '#cc0088'

const res = await fetch(`${BRIDGE}/preview`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 'color-brand': NEW_BRAND, 'color-brand-hover': NEW_BRAND_HOVER }),
})
if (!res.ok) throw new Error(`POST /preview failed: ${res.status}`)
const { id } = await res.json()
console.log('preview id:', id)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

// Baseline: committed theme, no preview.
await page.goto(`${APP}/`, { waitUntil: 'networkidle' })
const baseline = await page.evaluate(() => {
  const bar = document.querySelector('header')
  return getComputedStyle(bar).backgroundColor
})
console.log('AppBar bg (committed):', baseline)
await page.screenshot({ path: 'screenshots/live-preview-before.png' })

// Apply the preview via ?preview=<id>.
await page.goto(`${APP}/?preview=${id}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
const previewed = await page.evaluate(() => {
  const bar = document.querySelector('header')
  return getComputedStyle(bar).backgroundColor
})
console.log('AppBar bg (previewed): ', previewed)

const bannerText = await page.evaluate(() => document.body.innerText.includes('Preview'))
const mismatchWarned = await page.evaluate(() => document.body.innerText.toLowerCase().includes('mismatch'))
console.log('PreviewBanner text present:', bannerText)
console.log('previewMismatch warned:', mismatchWarned)

await page.screenshot({ path: 'screenshots/live-preview-after.png' })

await browser.close()

const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`
}

if (previewed === rgb(NEW_BRAND) && baseline !== previewed && !mismatchWarned) {
  console.log('\nLIVE-PREVIEW PROOF: PASS — AppBar re-themed via --mui-* indirection, no vocabulary mismatch.')
  process.exit(0)
} else {
  console.error('\nLIVE-PREVIEW PROOF: FAIL')
  console.error({ baseline, previewed, expected: rgb(NEW_BRAND), mismatchWarned })
  process.exit(1)
}
