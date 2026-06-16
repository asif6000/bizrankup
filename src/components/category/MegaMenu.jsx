import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { FiArrowRight, FiChevronRight } from 'react-icons/fi'

export default function MegaMenu() {
  const { categories } = useData()
  const [hovered, setHovered] = useState(null)

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top -translate-y-3 group-hover:translate-y-0 mt-2 w-[calc(100vw-2rem)] max-w-6xl">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-800 p-6 md:p-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="relative"
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link to={`/category/${cat.slug}`} className="group/cat block">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 ring-1 ring-black/5 dark:ring-white/10">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover/cat:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/cat:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-white bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg opacity-0 group-hover/cat:opacity-100 translate-y-2 group-hover/cat:translate-y-0 transition-all duration-300">
                      Shop Now <FiArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover/cat:text-[#FF4F8B] transition-colors">{cat.name}</h3>
                  <span className="text-[10px] font-medium text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg">{cat.productCount || 0}</span>
                </div>
              </Link>

              {cat.subcategories && (
                <div className={`mt-2 space-y-0.5 overflow-hidden transition-all duration-300 ${hovered === cat.id ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 lg:max-h-60 lg:opacity-100'}`}>
                  {cat.subcategories.map(sub => (
                    <Link
                      key={sub.id}
                      to={`/category/${cat.slug}/${sub.slug}`}
                      className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-gray-900 dark:text-gray-100 hover:text-[#FF4F8B] hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all group/sub"
                    >
                      <span>{sub.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-900 dark:text-gray-100">{sub.productCount || 0}</span>
                        <FiChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all" />
                      </div>
                    </Link>
                  ))}
                  <Link
                    to={`/category/${cat.slug}`}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-[#FF4F8B] hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all"
                  >
                    View All <FiArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>


      </div>
    </div>
  )
}
