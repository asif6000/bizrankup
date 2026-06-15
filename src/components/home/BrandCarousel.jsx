import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiStar } from 'react-icons/fi'
import { brands } from '../../data'

export default function BrandCarousel() {
  const scrollRef = useRef(null)

  const doubled = [...brands, ...brands]

  return (
    <section className="px-4 md:px-8 py-6 md:py-10 overflow-hidden">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Premium Brands</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">World-class names in beauty</p>
        </div>
        <Link to="/brands" className="text-sm font-semibold text-[#FF4F8B] hover:text-[#d63d6e] transition-colors">View All</Link>
      </div>

      <div ref={scrollRef} className="relative overflow-hidden">
        <div className="flex gap-5 animate-marquee hover:[animation-play-state:paused]">
          {doubled.map((brand, i) => (
            <Link
              key={`${brand.id}-${i}`}
              to={`/brand/${brand.slug}`}
              className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-[#FF4F8B]/30 transition-all duration-300 shrink-0 w-[260px]"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-700 p-2.5 shrink-0">
                <img src={brand.image} alt={brand.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-[#FF4F8B] transition-colors">{brand.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-0.5">
                    <FiStar className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">{brand.rating}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{brand.productCount} products</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
