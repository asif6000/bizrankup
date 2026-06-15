import { Link } from 'react-router-dom'
import { FiShoppingBag, FiHeart } from 'react-icons/fi'
import { formatPrice, calculateDiscount } from '../../utils/formatters'
import Rating from '../common/Rating'
import LazyImage from '../common/LazyImage'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

export default function ProductQuickView({ product, onClose }) {
  const { addItem } = useCart()
  const { toggleItem, isWishlisted } = useWishlist()
  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <LazyImage src={product.image} alt={product.name} className="w-full h-full" />
          </div>
          <div className="space-y-4">
            <p className="text-sm text-[#FF4F8B] font-medium">{product.brand.name}</p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h2>
            <Rating rating={product.rating} size="sm" showCount count={product.reviewCount} />
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
              {product.originalPrice && <span className="text-base text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>}
              {discount > 0 && <span className="text-sm font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-lg">Save {discount}%</span>}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>
            {product.inStock ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 bg-green-500 rounded-full" /> In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 bg-red-500 rounded-full" /> Out of Stock
              </span>
            )}
            {product.variants?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(v => (
                    <button key={v.name} className="px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:border-[#FF4F8B] hover:text-[#FF4F8B] transition-colors">{v.name}</button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 pt-2">
              <button onClick={() => addItem(product)} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 active:scale-95 transition-all">
                <FiShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
              <button onClick={() => toggleItem(product)} className={`p-3 rounded-xl border-2 transition-all ${isWishlisted(product.id) ? 'border-[#FF4F8B] bg-[#FF4F8B] text-white' : 'border-gray-200 dark:border-gray-700 hover:border-[#FF4F8B]'}`}>
                <FiHeart className={`w-4 h-4 ${isWishlisted(product.id) ? '' : ''}`} />
              </button>
            </div>
            <Link to={`/product/${product.id}`} className="block text-center text-sm text-[#FF4F8B] font-medium hover:underline mt-2">View Full Details</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
