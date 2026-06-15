import { useState } from 'react'
import { FiSliders } from 'react-icons/fi'

export default function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 200])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedRatings, setSelectedRatings] = useState(0)

  const brands = ['Luminous Beauty', 'Velvet Touch', 'Pure Glow', 'Rose Allure', 'Golden Hour', 'Crystal Clear']

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><FiSliders className="w-4 h-4" /> Filters</h3>

      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Price Range</h4>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">${priceRange[0]}</span>
          <input type="range" min={0} max={200} value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])} className="flex-1 accent-[#FF4F8B]" />
          <input type="range" min={0} max={200} value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])} className="flex-1 accent-[#FF4F8B]" />
          <span className="text-sm text-gray-500">${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Brand</h4>
        <div className="space-y-2">
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#FF4F8B] rounded" checked={selectedBrands.includes(brand)} onChange={() => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map(r => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="rating" className="accent-[#FF4F8B]" checked={selectedRatings === r} onChange={() => setSelectedRatings(r)} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{r}+ ★</span>
            </label>
          ))}
        </div>
        <button onClick={() => setSelectedRatings(0)} className="text-xs text-[#FF4F8B] mt-1 hover:underline">Clear</button>
      </div>
    </div>
  )
}
