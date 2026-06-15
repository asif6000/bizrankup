import { Link } from 'react-router-dom'
import { categories } from '../../data'
import { FiChevronRight } from 'react-icons/fi'

export default function CategoryGrid() {
  return (
    <section className="px-4 md:px-8 py-6 md:py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Find exactly what you need</p>
        </div>
        <Link to="/category/makeup" className="flex items-center gap-1 text-sm font-semibold text-[#FF4F8B] hover:text-[#d63d6e] transition-colors">
          All Categories <FiChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {categories.map(cat => (
          <Link key={cat.id} to={`/category/${cat.slug}`} className="group text-center">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 mb-3 p-4">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-[#FF4F8B] transition-colors">{cat.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cat.productCount} products</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
