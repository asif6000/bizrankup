import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { const saved = localStorage.getItem('cart'); return saved ? JSON.parse(saved) : [] }
    catch { return [] }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(items)) }, [items])

  const addItem = useCallback((product, quantity = 1, variant = null) => {
    setItems(prev => {
      const existing = prev.findIndex(i => i.id === product.id && i.variant?.name === variant?.name)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + quantity }
        return updated
      }
      return [...prev, { ...product, quantity, variant }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((id, variantName) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.variant?.name === variantName)))
  }, [])

  const updateQuantity = useCallback((id, variantName, quantity) => {
    if (quantity < 1) return
    setItems(prev => prev.map(i => i.id === id && i.variant?.name === variantName ? { ...i, quantity } : i))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
