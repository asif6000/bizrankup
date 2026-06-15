import { FiArrowUp, FiArrowDown } from 'react-icons/fi'

export default function SortOptions({ value, onChange }) {
  const options = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ]

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col"><FiArrowUp className="w-3 h-3 text-gray-400 -mb-1" /><FiArrowDown className="w-3 h-3 text-gray-400" /></div>
      <select value={value} onChange={e => onChange(e.target.value)} className="text-sm bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 outline-none focus:border-[#FF4F8B] transition-colors text-gray-700 dark:text-gray-300">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}
