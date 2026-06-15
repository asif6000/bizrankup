import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FiGrid, FiList, FiChevronRight, FiArrowDown, FiLoader } from 'react-icons/fi'
import { categories } from '../../data'
import ProductCard from './ProductCard'

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
]

export default function AllProductsSection({
  title = 'All Products',
  subtitle,
  products = [],
  categorySlug,
  showCategoryTabs = true,
  showSort = true,
  showViewToggle = true,
  link,
  linkText = 'View All',
  maxProducts,
  itemsPerPage = 8,
  className = '',
}) {
  const [activeCategory, setActiveCategory] = useState(categorySlug || 'all')
  const [sort, setSort] = useState('popular')
  const [view, setView] = useState('grid')
  const [visibleCount, setVisibleCount] = useState(itemsPerPage)
  const [loadingMore, setLoadingMore] = useState(false)

  const filtered = useMemo(() => {
    let result = [...products]
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category?.slug === activeCategory)
    }
    return result
  }, [products, activeCategory])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    switch (sort) {
      case 'price-low': return arr.sort((a, b) => a.price - b.price)
      case 'price-high': return arr.sort((a, b) => b.price - a.price)
      case 'rating': return arr.sort((a, b) => b.rating - a.rating)
      case 'newest': return arr.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      default: return arr.sort((a, b) => b.reviewCount - a.reviewCount)
    }
  }, [filtered, sort])

  const displayed = useMemo(() => {
    const items = maxProducts ? sorted.slice(0, maxProducts) : sorted.slice(0, visibleCount)
    return items
  }, [sorted, maxProducts, visibleCount])

  const hasMore = !maxProducts && visibleCount < sorted.length

  const loadMore = () => {
    setLoadingMore(true)
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + itemsPerPage, sorted.length))
      setLoadingMore(false)
    }, 400)
  }

  return (
    <section className={`px-4 md:px-8 py-6 md:py-10 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            {showSort && (
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-xl border-none outline-none focus:ring-2 focus:ring-[#FF4F8B]/30 cursor-pointer"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
            {showViewToggle && (
              <div className="hidden md:flex border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <button onClick={() => setView('grid')} className={`p-2 transition-colors ${view === 'grid' ? 'bg-[#FF4F8B] text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
                  <FiGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setView('list')} className={`p-2 transition-colors ${view === 'list' ? 'bg-[#FF4F8B] text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            )}
            {link && (
              <Link to={link} className="hidden md:flex items-center gap-1 text-sm font-semibold text-[#FF4F8B] hover:text-[#d63d6e] transition-colors shrink-0">
                {linkText} <FiChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {showCategoryTabs && (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 mb-6 scrollbar-hide">
            <button
              onClick={() => { setActiveCategory('all'); setVisibleCount(itemsPerPage) }}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white shadow-lg shadow-pink-500/25'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.slug}
                onClick={() => { setActiveCategory(cat.slug); setVisibleCount(itemsPerPage) }}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat.slug
                    ? 'bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white shadow-lg shadow-pink-500/25'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {displayed.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{displayed.length}</span> of <span className="font-semibold text-gray-900 dark:text-white">{sorted.length}</span> products
              </p>
            </div>

            {view === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {displayed.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {displayed.map(product => (
                  <ProductCard key={product.id} product={product} view="list" />
                ))}
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="group relative px-10 py-3.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#FF4F8B] hover:text-[#FF4F8B] transition-all flex items-center gap-2.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" /> Loading...
                    </>
                  ) : (
                    <>
                      <FiArrowDown className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> Load More ({sorted.length - visibleCount} remaining)
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FiGrid className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No products found</p>
            <p className="text-sm text-gray-400 mt-1">Try selecting a different category</p>
          </div>
        )}

        {link && (
          <div className="mt-6 text-center md:hidden">
            <Link to={link} className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF4F8B] hover:text-[#d63d6e] transition-colors">
              {linkText} <FiChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
