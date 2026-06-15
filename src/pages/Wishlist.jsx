import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import ProductCard from '../components/product/ProductCard'
import { useWishlist } from '../context/WishlistContext'
import { FiHeart } from 'react-icons/fi'

export default function Wishlist() {
  const { items } = useWishlist()

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
            <p className="text-sm text-gray-500 mt-1">{items.length} items saved</p>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save your favorite items here</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all">Start Shopping</Link>
          </div>
        )}
      </div>
    </Layout>
  )
}
