import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingBag, FiEye, FiStar, FiBarChart2 } from 'react-icons/fi'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import { useCompare } from '../../context/CompareContext'
import { formatPrice, calculateDiscount } from '../../utils/formatters'

export default function ProductCard({ product, flash, view = 'grid', compact }) {
  const { isWishlisted, toggleItem } = useWishlist()
  const { addItem } = useCart()
  const { isCompared, toggle: toggleCompare } = useCompare()
  const wishlisted = isWishlisted(product.id)
  const discount = product.discount || (product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0)

  if (compact) {
    return (
      <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-0.5 hover:border-pink-200 dark:hover:border-pink-800 transition-all duration-300">
        <div className="relative aspect-[1/1] overflow-hidden bg-gray-50 dark:bg-gray-900">
          <Link to={`/product/${product.id}`}>
            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </Link>
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
            {discount > 0 && <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-lg shadow-rose-500/40">-{discount}%</span>}
            {product.isNew && !discount && <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-lg shadow-purple-500/40">NEW</span>}
          </div>
          <button onClick={() => toggleItem(product)} className={`absolute top-1.5 right-1.5 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg ${wishlisted ? 'bg-[#FF4F8B] text-white shadow-pink-500/40 scale-110' : 'bg-white/90 backdrop-blur-sm text-gray-500 hover:bg-white opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0'}`}>
            <FiHeart className={`w-3 h-3 ${wishlisted ? 'fill-white' : ''}`} />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 flex gap-1">
            <button onClick={() => toggleCompare(product)} className={`flex-1 flex items-center justify-center gap-1 text-[10px] font-semibold py-1.5 rounded-lg transition-all ${isCompared(product.id) ? 'bg-[#7C3AED] text-white' : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white'}`}>
              <FiBarChart2 className="w-2.5 h-2.5" /> Compare
            </button>
            <button onClick={() => addItem(product)} className="flex-[2] bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white text-[10px] font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1 hover:shadow-lg hover:shadow-pink-500/30 active:scale-95 transition-all">
              <FiShoppingBag className="w-3 h-3" /> Add to Cart
            </button>
          </div>
        </div>
        <div className="p-2">
          <p className="text-[9px] text-gray-400 dark:text-gray-500 truncate">{product.brand.name}</p>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-[11px] font-semibold text-gray-900 dark:text-white leading-tight line-clamp-1 hover:text-[#FF4F8B] transition-colors mt-0.5">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="font-bold text-xs text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
            {product.originalPrice && <span className="text-[10px] text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>}
          </div>
          <div className="flex items-center gap-0.5 mt-1">
            {[1,2,3,4,5].map(i => (
              <FiStar key={i} className={`w-2.5 h-2.5 ${i <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-600'}`} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (view === 'list') {
    return (
      <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 flex">
        <div className="relative w-44 md:w-52 shrink-0 aspect-[3/4]">
          <Link to={`/product/${product.id}`}>
            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </Link>
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">-{discount}%</span>}
            {product.isNew && !discount && <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">NEW</span>}
          </div>
        </div>
        <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.brand.name}</p>
            <Link to={`/product/${product.id}`} className="text-base font-semibold text-gray-900 dark:text-white hover:text-[#FF4F8B] transition-colors line-clamp-1">{product.name}</Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{product.description}</p>
            <div className="flex items-center gap-1 mt-2">
              {[1,2,3,4,5].map(i => (
                <FiStar key={i} className={`w-3 h-3 ${i <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
              ))}
              <span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="font-bold text-base text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
              {product.originalPrice && <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(product.originalPrice)}</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleItem(product)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${wishlisted ? 'bg-[#FF4F8B] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-[#FF4F8B] hover:text-white'}`}>
                <FiHeart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
              </button>
              <button onClick={() => toggleCompare(product)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isCompared(product.id) ? 'bg-[#7C3AED] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-[#7C3AED] hover:text-white'}`}>
                <FiBarChart2 className="w-4 h-4" />
              </button>
              <button onClick={() => addItem(product)} className="px-4 h-9 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 hover:shadow-lg hover:shadow-pink-500/25 active:scale-95 transition-all">
                <FiShoppingBag className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </Link>

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg shadow-rose-500/30">-{discount}%</span>}
          {product.isNew && !discount && <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg shadow-purple-500/30">NEW</span>}
          {product.isBestSeller && discount === 0 && !product.isNew && <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg shadow-amber-500/30">BEST</span>}
          {product.isTrending && discount === 0 && !product.isNew && !product.isBestSeller && <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg shadow-cyan-500/30">TREND</span>}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button onClick={() => toggleItem(product)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${wishlisted ? 'bg-[#FF4F8B] text-white shadow-pink-500/40 scale-110' : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'}`}>
            <FiHeart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
          </button>
          <button onClick={() => toggleCompare(product)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${isCompared(product.id) ? 'bg-[#7C3AED] text-white shadow-purple-500/40' : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'}`}>
            <FiBarChart2 className="w-4 h-4" />
          </button>
        </div>

        {flash && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold text-center py-1.5 tracking-wider">
            ⚡ FLASH SALE
          </div>
        )}
      </div>

      <div className="p-3 md:p-4">
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1 truncate">{product.brand.name}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight mb-1.5 line-clamp-2 hover:text-[#FF4F8B] transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-0.5 mb-2">
          {[1,2,3,4,5].map(i => (
            <FiStar key={i} className={`w-3 h-3 ${i <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-600'}`} />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm md:text-base text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
          {product.originalPrice && <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>}
        </div>
        <div className="mt-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0">
          <button onClick={() => addItem(product)} className="flex-1 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white text-[11px] font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-pink-500/25 active:scale-95 transition-all">
            <FiShoppingBag className="w-3.5 h-3.5" /> Add to Cart
          </button>
          <Link to={`/product/${product.id}`} className="w-9 h-9 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-xl flex items-center justify-center hover:bg-[#FF4F8B] hover:text-white transition-all">
            <FiEye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
