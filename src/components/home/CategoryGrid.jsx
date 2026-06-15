import { Link } from 'react-router-dom'
import { FiArrowUpRight } from 'react-icons/fi'
import { categories } from '../../data'

export default function CategoryGrid() {
  return (
    <section className="px-4 md:px-8 py-6 md:py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Find your perfect match</p>
        </div>
        <Link to="/category/makeup" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#FF4F8B] hover:text-[#d63d6e] transition-colors">
          Explore All <FiArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {categories.map((cat, i) => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF4F8B]/0 to-[#7C3AED]/0 group-hover:from-[#FF4F8B]/20 group-hover:to-[#7C3AED]/20 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
              <span className="inline-block px-2 py-0.5 bg-white/15 backdrop-blur-sm text-white text-[9px] font-semibold rounded-full mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                {cat.productCount} products
              </span>
              <h3 className="text-base md:text-lg font-bold text-white group-hover:translate-x-0.5 transition-transform duration-300">{cat.name}</h3>
            </div>
            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-1 transition-all duration-300">
              <FiArrowUpRight className="w-3.5 h-3.5 text-white" />
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-4 text-center sm:hidden">
        <Link to="/category/makeup" className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF4F8B] hover:text-[#d63d6e] transition-colors">
          Explore All <FiArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  )
}
