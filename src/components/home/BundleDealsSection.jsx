import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiPercent, FiShoppingBag } from 'react-icons/fi'
import { products } from '../../data'

const bundles = [
  {
    id: 1,
    name: 'The Glow Starter',
    desc: 'Everything you need for radiant skin',
    discount: 20,
    products: products.slice(0, 3),
    gradient: 'from-rose-100 via-pink-50 to-purple-100 dark:from-rose-900/20 dark:via-pink-900/10 dark:to-purple-900/20',
    badge: 'Best Value',
  },
  {
    id: 2,
    name: 'Makeup Must-Haves',
    desc: 'Build your perfect everyday look',
    discount: 15,
    products: products.slice(10, 13),
    gradient: 'from-amber-100 via-orange-50 to-rose-100 dark:from-amber-900/20 dark:via-orange-900/10 dark:to-rose-900/20',
    badge: 'Popular',
  },
  {
    id: 3,
    name: 'Luxury Hair Set',
    desc: 'Nourish, style, and protect',
    discount: 25,
    products: products.slice(20, 23),
    gradient: 'from-emerald-100 via-teal-50 to-cyan-100 dark:from-emerald-900/20 dark:via-teal-900/10 dark:to-cyan-900/20',
    badge: 'Save Big',
  },
]

export default function BundleDealsSection() {
  return (
    <section className="px-4 md:px-8 py-6 md:py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Curated Sets</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Complete routines handpicked for you</p>
        </div>
        <Link to="/shop?sort=popular" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#FF4F8B] hover:text-[#d63d6e] transition-colors">
          View All Sets <FiArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {bundles.map(bundle => {
          const totalOriginal = bundle.products.reduce((sum, p) => sum + p.price, 0)
          const bundlePrice = totalOriginal * (1 - bundle.discount / 100)

          return (
            <Link
              key={bundle.id}
              to="/shop?sort=popular"
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${bundle.gradient} border border-gray-100 dark:border-gray-700/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500 p-5 md:p-6`}
            >
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/40 dark:bg-white/5 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-[9px] font-semibold rounded-full text-[#FF4F8B]">
                    <FiPercent className="w-2.5 h-2.5" /> Save {bundle.discount}%
                  </span>
                  <span className="px-2.5 py-1 bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm text-[9px] font-semibold rounded-full text-gray-600 dark:text-gray-300">
                    {bundle.badge}
                  </span>
                </div>

                <div className="flex items-center -space-x-3 mb-4">
                  {bundle.products.slice(0, 3).map((p, i) => (
                    <div
                      key={p.id}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 border-white dark:border-gray-800 shadow-md transform transition-transform duration-300"
                      style={{ zIndex: 3 - i }}
                    >
                      <img src={p.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/60 dark:bg-gray-800/60 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400">
                    +{bundle.products.length}
                  </div>
                </div>

                <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-[#FF4F8B] transition-colors">{bundle.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 mb-3">{bundle.desc}</p>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">${bundlePrice.toFixed(2)}</span>
                  <span className="text-sm text-gray-400 line-through">${totalOriginal.toFixed(2)}</span>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#FF4F8B] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0">
                  <FiShoppingBag className="w-3.5 h-3.5" /> Shop This Set
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-4 text-center sm:hidden">
        <Link to="/shop?sort=popular" className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF4F8B] hover:text-[#d63d6e] transition-colors">
          View All Sets <FiArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  )
}
