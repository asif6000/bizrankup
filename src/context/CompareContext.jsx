import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'shajgoj_compare'
const MAX_COMPARE = 4

function loadSaved() {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : [] } catch { return [] }
}

const CompareContext = createContext()

export function CompareProvider({ children }) {
  const [items, setItems] = useState(loadSaved)

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) }, [items])

  const add = useCallback((product) => {
    setItems(prev => {
      if (prev.find(p => p.id === product.id)) return prev
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, product]
    })
  }, [])

  const remove = useCallback((id) => {
    setItems(prev => prev.filter(p => p.id !== id))
  }, [])

  const toggle = useCallback((product) => {
    setItems(prev => {
      if (prev.find(p => p.id === product.id)) return prev.filter(p => p.id !== product.id)
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, product]
    })
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const isCompared = useCallback((id) => items.some(p => p.id === id), [items])

  return (
    <CompareContext.Provider value={{ items, add, remove, toggle, clear, isCompared, count: items.length }}>
      {children}
    </CompareContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
