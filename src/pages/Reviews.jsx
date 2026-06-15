import { useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import RatingsReviews from '../components/product/RatingsReviews'
import { useAuth } from '../context/AuthContext'
import { useReview } from '../context/ReviewContext'

export default function Reviews() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { reviews } = useReview()

  if (!user) { navigate('/login'); return null }

  const myReviews = reviews.filter(r => r.userName === user.name || r.userId === user.id)

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">My Reviews</h1>
        <p className="text-sm text-gray-500 mb-8">Reviews you&rsquo;ve written ({myReviews.length})</p>
        <RatingsReviews reviews={myReviews} />
      </div>
    </Layout>
  )
}
