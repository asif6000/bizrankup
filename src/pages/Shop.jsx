import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import AllProductsSection from '../components/product/AllProductsSection'
import { useData } from '../context/DataContext'
import { FiChevronRight, FiStar, FiArrowRight } from 'react-icons/fi'

export default function Shop() {
  const { categories, brands, products } = useData()
  return (
    <Layout>
      <div className="bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF4F8B]/10 text-[#FF4F8B] text-xs font-semibold rounded-full mb-4">New Collection</span>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">Shop Our <br className="hidden md:block" /><span className="bg-gradient-to-r from-[#FF4F8B] to-[#7C3AED] bg-clip-text text-transparent">Premium Beauty</span></h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">Discover curated collections from the world's finest beauty brands. Exclusive products you won't find anywhere else.</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link to="/category/makeup" className="px-6 py-3 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 active:scale-95 transition-all">Shop Makeup</Link>
                <Link to="/category/skincare" className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:border-[#FF4F8B] hover:text-[#FF4F8B] active:scale-95 transition-all">Explore Skincare</Link>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3 max-w-md">
              {categories.slice(0, 4).map(cat => (
                <Link key={cat.id} to={`/category/${cat.slug}`} className="group relative aspect-square rounded-2xl overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-white text-xs font-semibold">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
          <Link to="/products" className="text-sm font-semibold text-[#FF4F8B] hover:text-[#d63d6e] transition-colors flex items-center gap-1">View All <FiChevronRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map(cat => (
            <Link key={cat.id} to={`/category/${cat.slug}`} className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
              <div className="w-12 h-12 rounded-xl overflow-hidden">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <AllProductsSection
        title="All Products"
        subtitle="Browse our complete collection"
        products={products}
        itemsPerPage={12}
        showCategoryTabs
        showSort
        showViewToggle
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Featured Brands</h2>
          <Link to="/products" className="text-sm font-semibold text-[#FF4F8B] hover:text-[#d63d6e] transition-colors flex items-center gap-1">View All <FiChevronRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {brands.slice(0, 4).map(brand => (
            <Link key={brand.id} to={`/brand/${brand.slug}`} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 p-2">
                <img src={brand.image} alt={brand.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-[#FF4F8B] transition-colors">{brand.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <FiStar className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-gray-500">{brand.rating}</span>
                  <span className="text-xs text-gray-400 ml-1">({brand.productCount})</span>
                </div>
              </div>
              <FiArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF4F8B] transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}
