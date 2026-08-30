// Scripted "Indigo Classic -> Acid Wash" re-theme moment (build-order step 7),
// using the kit's committed second variant (sorb-demo-kit/tokens/variants/acid-wash.json)
// pushed through the local bridge exactly as a Figma-driven push would.
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'

const APP = process.argv[2] || 'http://127.0.0.1:5183'
const BRIDGE = process.argv[3] || 'http://localhost:7783'

const acidWash = JSON.parse(
  readFileSync(new URL('../node_modules/@metatoy/janes-jeans/tokens/variants/acid-wash.json', import.meta.url)),
)

// Flatten the color.* tier to the same kebab cssVar keys the css platform
// generates (color-surface, color-brand, ...) -- no leading `--` (see
// sorb-leaf/src/apply.js: setProperty(`--${key}`, value)).
const flat = {}
for (const [key, node] of Object.entries(acidWash.color)) {
  flat[`color-${key}`] = node.$value
}
console.log('Pushing', Object.keys(flat).length, 'acid-wash color tokens:', Object.keys(flat).join(', '))

const res = await fetch(`${BRIDGE}/preview`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(flat),
})
if (!res.ok) throw new Error(`POST /preview failed: ${res.status}`)
const { id } = await res.json()
console.log('preview id:', id)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } })

await page.goto(`${APP}/`, { waitUntil: 'networkidle' })
await page.screenshot({ path: 'screenshots/acid-wash-before-indigo-classic.png', fullPage: true })

await page.goto(`${APP}/?preview=${id}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
const mismatch = await page.evaluate(() => document.body.innerText.toLowerCase().includes('mismatch'))
console.log('previewMismatch warned:', mismatch)
await page.screenshot({ path: 'screenshots/acid-wash-after-acid-wash.png', fullPage: true })

await page.goto(`${APP}/product/high-rise-straight-indigo?preview=${id}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
await page.screenshot({ path: 'screenshots/acid-wash-after-pdp.png', fullPage: true })

await browser.close()
console.log(mismatch ? 'FAIL: vocabulary mismatch' : 'OK: acid-wash re-theme captured, no mismatch')
