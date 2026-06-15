import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ReviewContext = createContext()

const STORAGE_KEY = 'shajgoj_reviews'

const seedReviews = [
  { id: 1, productId: 1, userId: 99, userName: 'Sophie M.', userAvatar: 'https://i.pravatar.cc/80?u=1', rating: 5, title: 'Absolutely love it!', text: 'My skin has never looked better. The texture is so smooth and it absorbs quickly without any greasy feeling.', date: '2026-05-12', helpful: 42 },
  { id: 2, productId: 2, userId: 99, userName: 'Emma L.', userAvatar: 'https://i.pravatar.cc/80?u=2', rating: 4, title: 'Great quality', text: 'Great quality for the price. I noticed a visible difference after just two weeks of use.', date: '2026-05-10', helpful: 28 },
  { id: 3, productId: 1, userId: 99, userName: 'Jessica K.', userAvatar: 'https://i.pravatar.cc/80?u=3', rating: 5, title: 'Gorgeous packaging', text: 'The packaging is gorgeous and the product itself is amazing. It gives such a natural glow.', date: '2026-05-08', helpful: 35 },
  { id: 4, productId: 3, userId: 99, userName: 'Rachel D.', userAvatar: 'https://i.pravatar.cc/80?u=4', rating: 4, title: 'Really impressed', text: 'Really impressed with the quality. My makeup stays in place all day.', date: '2026-05-05', helpful: 19 },
]

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setReviews(JSON.parse(stored))
      } else {
        setReviews(seedReviews)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedReviews))
      }
    } catch {
      setReviews(seedReviews)
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
    }
  }, [reviews, loaded])

  const addReview = useCallback(({ productId, userId, userName, userAvatar, rating, title, text }) => {
    const newReview = {
      id: Date.now(),
      productId,
      userId,
      userName,
      userAvatar,
      rating,
      title,
      text,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
    }
    setReviews(prev => [newReview, ...prev])
    return newReview
  }, [])

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
