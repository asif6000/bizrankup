import { FiHeart } from 'react-icons/fi'
import { useWishlist } from '../../context/WishlistContext'

export default function WishlistButton({ product, size = 'md', className = '' }) {
  const { isWishlisted, toggleItem } = useWishlist()
  const wishlisted = isWishlisted(product.id)
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' }

  return (
    <button
      onClick={() => toggleItem(product)}
      className={`${sizes[size]} rounded-xl flex items-center justify-center transition-all duration-300 ${wishlisted ? 'bg-[#FF4F8B] text-white shadow-lg shadow-pink-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'} ${className}`}
    >
      <FiHeart className={`w-4 h-4 md:w-5 md:h-5 ${wishlisted ? 'fill-white' : ''}`} />
    </button>
  )
}
