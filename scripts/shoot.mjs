import { chromium } from 'playwright'
const BASE = process.argv[2] || 'http://localhost:4173'
const [route, out] = [process.argv[3] || '/', process.argv[4] || 'screenshots/shot.png']
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })
await page.screenshot({ path: out, fullPage: true })
await browser.close()
console.log('saved', out)
