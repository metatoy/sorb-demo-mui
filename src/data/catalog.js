import productsData from '@metatoy/janes-jeans/fixtures/products.json'
import navData from '@metatoy/janes-jeans/fixtures/nav.json'
import copyData from '@metatoy/janes-jeans/fixtures/copy.json'

export const products = productsData.products
export const nav = navData
export const copy = copyData

export const HERO_SLUG = products[0].slug

export const findProduct = (slug) => products.find((p) => p.slug === slug)

export const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`

export const assetUrl = (imageRef) =>
  new URL(`../../node_modules/@metatoy/janes-jeans/assets/${imageRef}`, import.meta.url).href
