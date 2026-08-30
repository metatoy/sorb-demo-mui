import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'
import { products } from './catalog'

const STORAGE_KEY = 'jj-mui-cart'

const CartContext = createContext(null)

const load = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.warn('[jj-mui] cart load failed', e)
    return []
  }
}

// Client-state-only cart (no backend, no payments — see demo-sites-multistack.md Non-goals).
export const CartProvider = ({ children }) => {
  const [lines, setLines] = useState(load)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch (e) {
      console.warn('[jj-mui] cart save failed', e)
    }
  }, [lines])

  const addItem = useCallback((productId, size, qty = 1) => {
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.productId === productId && l.size === size)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + qty }
        return next
      }
      return [...prev, { productId, size, qty }]
    })
  }, [])

  const setQty = useCallback((productId, size, qty) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => !(l.productId === productId && l.size === size))
        : prev.map((l) => (l.productId === productId && l.size === size ? { ...l, qty } : l)),
    )
  }, [])

  const removeItem = useCallback((productId, size) => {
    setLines((prev) => prev.filter((l) => !(l.productId === productId && l.size === size)))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const detailedLines = useMemo(
    () =>
      lines
        .map((l) => ({ ...l, product: products.find((p) => p.id === l.productId) }))
        .filter((l) => l.product),
    [lines],
  )

  const subtotalCents = useMemo(
    () => detailedLines.reduce((sum, l) => sum + l.product.priceCents * l.qty, 0),
    [detailedLines],
  )

  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines])

  const value = useMemo(
    () => ({ lines: detailedLines, addItem, setQty, removeItem, clear, subtotalCents, itemCount }),
    [detailedLines, addItem, setQty, removeItem, clear, subtotalCents, itemCount],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
