import { FiThumbsUp, FiMessageCircle } from 'react-icons/fi'
import Rating from '../common/Rating'
import { formatDate } from '../../utils/formatters'

export default function RatingsReviews({ reviews }) {
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <div>
      <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
        <div className="text-center">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">{avgRating.toFixed(1)}</span>
          <Rating rating={avgRating} size="xs" />
          <p className="text-sm text-gray-500 mt-1">{reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map(star => {
            const count = reviews.filter(r => Math.floor(r.rating) === star).length
            const pct = (count / reviews.length) * 100
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400 w-8">{star} ★</span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-gray-500 text-xs w-8">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <img src={review.avatar} alt="" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{review.user}</p>
                  <Rating rating={review.rating} size="xs" />
                </div>
              </div>
              <span className="text-xs text-gray-400">{formatDate(review.date)}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{review.text}</p>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#FF4F8B] transition-colors"><FiThumbsUp className="w-3.5 h-3.5" /> Helpful ({review.helpful})</button>
              <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#FF4F8B] transition-colors"><FiMessageCircle className="w-3.5 h-3.5" /> Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
