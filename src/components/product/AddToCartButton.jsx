import { FiShoppingBag } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'

export default function AddToCartButton({ product, variant = null, size = 'md', className = '', children }) {
  const { addItem } = useCart()
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-sm', lg: 'px-8 py-4 text-base' }

  return (
    <button
      onClick={() => addItem(product, 1, variant)}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white hover:shadow-lg hover:shadow-pink-500/25 active:scale-95 transition-all duration-300 ${sizes[size]} ${className}`}
    >
      <FiShoppingBag className="w-4 h-4" />
      {children || 'Add to Cart'}
    </button>
  )
}
