import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { const saved = localStorage.getItem('wishlist'); return saved ? JSON.parse(saved) : [] }
    catch { return [] }
  })

  useEffect(() => { localStorage.setItem('wishlist', JSON.stringify(items)) }, [items])

  const toggleItem = useCallback((product) => {
    setItems(prev => prev.some(i => i.id === product.id) ? prev.filter(i => i.id !== product.id) : [...prev, product])
  }, [])

  const isWishlisted = useCallback((id) => items.some(i => i.id === id), [items])

  return <WishlistContext.Provider value={{ items, toggleItem, isWishlisted, count: items.length }}>{children}</WishlistContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => useContext(WishlistContext)
