
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function QuantitySelector({ value, onChange, min = 1, max = 99, size = 'md' }) {
  const sizes = { sm: 'w-7 h-7', md: 'w-9 h-9', lg: 'w-10 h-10' }
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

  return (
    <div className="inline-flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button onClick={() => onChange(Math.max(min, value - 1))} className={`${sizes[size]} flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400`}><FiChevronLeft className={textSizes[size]} /></button>
      <span className={`${textSizes[size]} font-semibold text-gray-900 dark:text-white min-w-[2.5rem] text-center select-none`}>{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} className={`${sizes[size]} flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400`}><FiChevronRight className={textSizes[size]} /></button>
    </div>
  )
}
