import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import ProductCard from '../product/ProductCard'
import { products } from '../../data'

const TABS = [
  { key: 'featured', label: 'Featured' },
  { key: 'new', label: 'New Arrivals' },
  { key: 'trending', label: 'Trending' },
  { key: 'bestseller', label: 'Best Sellers' },
]

export default function ProductTabsShowcase() {
  const [activeTab, setActiveTab] = useState('featured')

  const filtered = useMemo(() => {
    const map = {
      featured: products.slice(0, 8),
      new: products.filter(p => p.isNew).slice(0, 8),
      trending: products.filter(p => p.isTrending).slice(0, 8),
      bestseller: products.filter(p => p.isBestSeller).slice(0, 8),
    }
    return map[activeTab] || map.featured
  }, [activeTab])

  return (
    <section className="px-4 md:px-8 py-6 md:py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Discover Our Collection</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Curated just for you</p>
        </div>
        <Link to="/search?sort=popular" className="flex items-center gap-1 text-sm font-semibold text-[#FF4F8B] hover:text-[#d63d6e] transition-colors shrink-0">
          View All <FiChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit mb-6">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
              activeTab === tab.key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
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
