import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { reviews as reviewsApi } from '../api/client'

const ReviewContext = createContext()

function mapApiReview(r) {
  return {
    id: r.id,
    productId: r.product_id,
    userId: r.user_id,
    userName: r.user_name || 'Customer',
    userAvatar: `https://i.pravatar.cc/80?u=${r.user_id}`,
    rating: Number(r.rating),
    title: '',
    text: r.comment || '',
    date: r.created_at ? r.created_at.split('T')[0] : '',
    helpful: 0,
  }
}

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState([])
  const fetchAllRef = useRef(null)

  const fetchAllReviews = useCallback(async () => {
    try {
      const data = await reviewsApi.listAll()
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map(mapApiReview)
        setReviews(mapped)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    fetchAllRef.current = fetchAllReviews
    fetchAllRef.current()

    const es = new EventSource('/api/events/stream')
    es.addEventListener('data:change', (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.table === 'reviews') fetchAllRef.current()
      } catch { /* ignore */ }
    })
    es.onerror = () => {}

    const interval = setInterval(() => fetchAllRef.current(), 30000)
    return () => { es.close(); clearInterval(interval) }
  }, [fetchAllReviews])

  const addReview = useCallback(async ({ productId, rating, text, title }) => {
    const optimistic = {
      id: Date.now(),
      productId,
      userId: 0,
      userName: 'You',
      userAvatar: '',
      rating,
      title: title || '',
      text: text || '',
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
    }
    setReviews(prev => [optimistic, ...prev])
    try {
      await reviewsApi.create({ product_id: productId, rating, comment: text })
      fetchAllReviews()
    } catch { /* ignore */ }
    return optimistic
  }, [fetchAllReviews])

  const getProductReviews = useCallback((productId) => {
    return reviews.filter(r => r.productId === productId)
  }, [reviews])

  const getProductRating = useCallback((productId) => {
    const productReviews = reviews.filter(r => r.productId === productId)
    if (productReviews.length === 0) return { avg: 0, count: 0 }
    const avg = productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length
    return { avg: Math.round(avg * 10) / 10, count: productReviews.length }
  }, [reviews])

  return (
    <ReviewContext.Provider value={{ reviews, addReview, getProductReviews, getProductRating }}>
      {children}
    </ReviewContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useReview = () => useContext(ReviewContext)
