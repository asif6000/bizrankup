import { Link } from 'react-router-dom'
import { FiShoppingBag, FiChevronRight } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatters'

export default function FloatingCartButton() {
  const { totalItems, subtotal } = useCart()

  if (totalItems === 0) return null

  return (
    <div className="bg-gradient-to-r from-[#FF4F8B]/10 to-[#7C3AED]/10 rounded-2xl border border-[#FF4F8B]/20 p-4 md:p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#FF4F8B] to-[#FF6B9D] rounded-xl flex items-center justify-center">
          <FiShoppingBag className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Shopping Cart</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{totalItems} item{totalItems > 1 ? 's' : ''} — {formatPrice(subtotal)}</p>
        </div>
        <Link
          to="/cart"
          className="shrink-0 px-4 py-2 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white text-xs font-semibold rounded-xl flex items-center gap-1 hover:shadow-lg hover:shadow-pink-500/25 active:scale-95 transition-all"
        >
          View Cart <FiChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
