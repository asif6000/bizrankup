import { useState } from 'react'

const STORAGE_KEY = 'bizrank_recently_viewed'
const MAX_ITEMS = 12

export function useRecentlyViewed() {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })

  const add = (product) => {
    setItems(prev => {
      const filtered = prev.filter(p => p.id !== product.id)
      const next = [product, ...filtered].slice(0, MAX_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY)
    setItems([])
  }

  return { items, add, clear }
}
