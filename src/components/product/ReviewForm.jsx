import { useState } from 'react'
import { FiStar, FiSend, FiX } from 'react-icons/fi'

export default function ReviewForm({ productId, userName, userAvatar, onSubmit, onClose }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating === 0) return
    onSubmit({ productId, rating, title, text })
    setSubmitted(true)
    setTimeout(() => {
      if (onClose) onClose()
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-center animate-fade-in">
        <div className="w-12 h-12 mx-auto mb-3 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <FiSend className="w-5 h-5 text-green-500" />
        </div>
        <p className="font-semibold text-gray-900 dark:text-white">Review Submitted!</p>
        <p className="text-sm text-gray-500 mt-1">Thank you for sharing your feedback.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white">Write a Review</h3>
        {onClose && (
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <FiX className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Rating</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i)}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-all duration-150 hover:scale-110"
              >
                <FiStar
                  className={`w-7 h-7 md:w-8 md:h-8 ${
                    i <= (hoverRating || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-200 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating === 0 && <p className="text-xs text-red-400 mt-1">Please select a rating</p>}
        </div>

        <div>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Review headline (optional)"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white rounded-xl outline-none focus:border-[#FF4F8B] focus:ring-1 focus:ring-[#FF4F8B]/20 transition-all placeholder:text-gray-400"
          />
        </div>

        <div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            required
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white rounded-xl outline-none focus:border-[#FF4F8B] focus:ring-1 focus:ring-[#FF4F8B]/20 transition-all resize-none placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          {onClose && (
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={rating === 0}
            className="px-6 py-2.5 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FiSend className="w-3.5 h-3.5" /> Submit Review
          </button>
        </div>
      </form>
    </div>
  )
}
