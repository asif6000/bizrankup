import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiShoppingBag, FiClock, FiTag, FiGift } from 'react-icons/fi'
import { products } from '../../data'

const bundles = [
  {
    id: 1,
    name: 'The Glow Starter',
    desc: 'Everything you need for radiant skin',
    discount: 20,
    products: products.slice(0, 4),
    gradient: 'from-rose-100 via-pink-50 to-purple-50 dark:from-rose-950/30 dark:via-pink-950/20 dark:to-purple-950/30',
    badge: 'Best Value',
    badgeColor: 'bg-rose-500',
    decor: 'from-rose-200/30 to-pink-200/20 dark:from-rose-500/10 dark:to-pink-500/5',
    accent: '#FF4F8B',
  },
  {
    id: 2,
    name: 'Makeup Must-Haves',
    desc: 'Build your perfect everyday look',
    discount: 15,
    products: products.slice(10, 14),
    gradient: 'from-amber-100 via-orange-50 to-rose-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/30',
    badge: 'Most Popular',
    badgeColor: 'bg-amber-500',
    decor: 'from-amber-200/30 to-orange-200/20 dark:from-amber-500/10 dark:to-orange-500/5',
    accent: '#F59E0B',
  },
  {
    id: 3,
    name: 'Luxury Hair Set',
    desc: 'Nourish, style, and protect',
    discount: 25,
    products: products.slice(20, 24),
    gradient: 'from-emerald-100 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/30',
    badge: 'Biggest Saving',
    badgeColor: 'bg-emerald-500',
    decor: 'from-emerald-200/30 to-teal-200/20 dark:from-emerald-500/10 dark:to-teal-500/5',
    accent: '#10B981',
  },
]

function SavingMeter({ discount }) {
  return (
    <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-1.5 mt-3 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#FF4F8B] to-[#7C3AED] transition-all duration-1000"
        style={{ width: `${discount * 3}%` }}
      />
    </div>
  )
}

export default function BundleDealsSection() {
  return (
    <section className="px-4 md:px-8 py-6 md:py-10">
      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#FF4F8B]/10 to-purple-500/10 dark:from-[#FF4F8B]/20 dark:to-purple-500/20 rounded-full mb-3">
              <FiGift className="w-3 h-3 text-[#FF4F8B]" />
              <span className="text-[10px] font-semibold text-[#FF4F8B] tracking-wider uppercase">Bundle & Save</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Curated <span className="bg-gradient-to-r from-[#FF4F8B] to-[#7C3AED] bg-clip-text text-transparent">Sets</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Complete routines handpicked for you — save big when you bundle</p>
          </div>
          <Link to="/shop?sort=popular" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#FF4F8B] hover:text-white border border-[#FF4F8B]/30 hover:bg-[#FF4F8B] rounded-xl transition-all group/btn">
            View All Sets <FiArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {bundles.map(bundle => {
            const totalOriginal = bundle.products.reduce((sum, p) => sum + p.price, 0)
            const bundlePrice = totalOriginal * (1 - bundle.discount / 100)
            const saved = totalOriginal - bundlePrice

            return (
              <Link
                key={bundle.id}
                to="/shop?sort=popular"
                className="group relative block"
              >
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bundle.gradient} border border-gray-100 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-pink-500/5 hover:-translate-y-1 transition-all duration-500 p-5 md:p-6`}>
                  <div className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${bundle.decor} rounded-full blur-3xl`} />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/30 dark:bg-white/5 rounded-full blur-2xl" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-[10px] font-bold rounded-full shadow-sm" style={{ color: bundle.accent }}>
                        <FiTag className="w-2.5 h-2.5" /> Save {bundle.discount}%
                      </span>
                      <span className={`px-2.5 py-1 ${bundle.badgeColor} text-white text-[9px] font-bold rounded-full shadow-sm`}>
                        {bundle.badge}
                      </span>
                    </div>

                    <div className="flex items-center mb-6">
                      <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 dark:to-transparent rounded-3xl blur-md" />
                        <div className="relative flex items-center -space-x-4 md:-space-x-5">
                          {bundle.products.slice(0, 4).map((p, i) => (
                            <div
                              key={p.id}
                              className="relative w-[68px] h-[68px] md:w-[76px] md:h-[76px] rounded-xl overflow-hidden border-[2.5px] border-white dark:border-gray-800 shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-500"
                              style={{
                                zIndex: 10 - i,
                                transform: `rotate(${(i - 1.5) * 6}deg)`,
                                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              }}
                            >
                              <img
                                src={p.image}
                                alt=""
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          ))}
                          <div
                            className="relative w-[68px] h-[68px] md:w-[76px] md:h-[76px] rounded-xl flex items-center justify-center shadow-lg border-[2.5px] border-white dark:border-gray-800 text-white group-hover:-translate-y-1 transition-all duration-500"
                            style={{
                              background: 'linear-gradient(135deg, #FF4F8B, #7C3AED)',
                              transform: `rotate(10deg)`,
                            }}
                          >
                            <span className="flex flex-col items-center leading-tight">
                              <FiShoppingBag className="w-4 h-4 mb-0.5" />
                              +{bundle.products.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg md:text-xl text-gray-900 dark:text-white group-hover:text-[#FF4F8B] transition-colors">{bundle.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 mb-3 line-clamp-1">{bundle.desc}</p>

                    <div className="flex items-baseline gap-2.5 mb-1">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">${bundlePrice.toFixed(2)}</span>
                      <span className="text-sm text-gray-400 line-through">${totalOriginal.toFixed(2)}</span>
                      <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-md">Save ${saved.toFixed(2)}</span>
                    </div>

                    <SavingMeter discount={bundle.discount} />

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/30">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <FiClock className="w-3 h-3" /> Limited
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-[#FF4F8B] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        Shop Now <FiArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-5 text-center sm:hidden">
          <Link to="/shop?sort=popular" className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-[#FF4F8B] hover:text-white border border-[#FF4F8B]/30 hover:bg-[#FF4F8B] rounded-xl transition-all">
            View All Sets <FiArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
