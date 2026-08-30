import { chromium } from 'playwright'

const BASE = process.argv[2] || 'http://localhost:4173'
const routes = ['/', '/shop', '/product/high-rise-straight-indigo', '/cart', '/checkout', '/account', '/about']

const browser = await chromium.launch()
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`[console.error] ${msg.text()}`)
})

for (const route of routes) {
  const res = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })
  console.log(route, '->', res.status())
}

await page.screenshot({ path: 'screenshots/smoke-home.png', fullPage: true })

await browser.close()

if (errors.length) {
  console.error('ERRORS:\n' + errors.join('\n'))
  process.exit(1)
} else {
  console.log('No console/page errors across', routes.length, 'routes.')
}
