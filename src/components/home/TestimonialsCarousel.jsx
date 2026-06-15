import { useState, useEffect, useCallback } from 'react'
import { FiStar, FiChevronLeft, FiChevronRight, FiMessageCircle } from 'react-icons/fi'
import { reviews } from '../../data'

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent(prev => (prev + 1) % reviews.length), [])
  const prev = useCallback(() => setCurrent(prev => (prev - 1 + reviews.length) % reviews.length), [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="px-4 md:px-8 py-6 md:py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">What Our Customers Say</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real reviews from real people</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="hidden sm:flex items-center gap-1 text-xs text-gray-400 mr-2">
            <FiMessageCircle className="w-3.5 h-3.5" /> {reviews.length} reviews
          </span>
          <button onClick={prev} className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
            <FiChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          <button onClick={next} className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
            <FiChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {reviews.map((review, i) => (
            <div
              key={review.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 md:p-6 transition-all duration-500 ${
                i === current
                  ? 'ring-2 ring-[#FF4F8B] shadow-lg shadow-pink-500/10 scale-[1.02]'
                  : 'opacity-60 md:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700" />
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{review.user}</h4>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <FiStar key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-600'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 dark:border-gray-700">
                <span className="text-xs text-gray-400">{review.date}</span>
                <span className="text-xs text-gray-400">{review.helpful} found helpful</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-4">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-[#FF4F8B]' : 'w-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
