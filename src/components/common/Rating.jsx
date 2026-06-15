import { FiStar } from 'react-icons/fi'

export default function Rating({ rating = 0, size = 'sm', showCount, count = 0 }) {
  const sizes = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }
  const full = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(i => (
          <FiStar key={i} className={`${sizes[size]} ${i <= full ? 'fill-amber-400 text-amber-400' : i === full + 1 && hasHalf ? 'fill-amber-400/50 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
        ))}
      </div>
      {showCount && <span className="text-sm text-gray-500 dark:text-gray-400">({count.toLocaleString()})</span>}
    </div>
  )
}
