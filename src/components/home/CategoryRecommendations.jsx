import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import ProductCard from '../product/ProductCard'
import { useData } from '../../context/DataContext'

const LS_KEY = 'bizrank_last_category'

export default function CategoryRecommendations() {
  const { products } = useData()
  const [lastCategory, setLastCategory] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) setLastCategory(JSON.parse(raw))
    } catch { /* ignore */ }
  }, [])

  if (!lastCategory) return null

  const catId = lastCategory.id
  const catName = lastCategory.name || ''
  const filtered = products.filter(p => p.category.id === catId).slice(0, 8)
  if (filtered.length === 0) return null

  const catSlug = catName.toLowerCase().replace(/\s+/g, '-')

  return (
    <section className="px-4 md:px-8 py-6 md:py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            You Might Also Like
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            More from <span className="font-semibold text-[#FF4F8B]">{catName}</span>
          </p>
        </div>
        <Link
          to={`/category/${catSlug}`}
          className="flex items-center gap-1 text-sm font-semibold text-[#FF4F8B] hover:text-[#d63d6e] transition-colors shrink-0"
        >
          View All <FiChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {filtered.map(product => (
          <div key={product.id} className="animate-fade-in">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
