import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { useCompare } from '../context/CompareContext'
import { formatPrice } from '../utils/formatters'
import Rating from '../components/common/Rating'
import { FiTrash2, FiShoppingBag, FiHeart, FiX } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const specs = [
  { key: 'brand', label: 'Brand', fn: (p) => p.brand?.name || '-' },
  { key: 'price', label: 'Price', fn: (p) => formatPrice(p.price) },
  { key: 'originalPrice', label: 'Original Price', fn: (p) => p.originalPrice ? formatPrice(p.originalPrice) : '-' },
  { key: 'rating', label: 'Rating', fn: (p) => <Rating rating={p.rating} size="sm" showCount count={p.reviewCount} /> },
  { key: 'inStock', label: 'Availability', fn: (p) => p.inStock ? <span className="text-green-600 font-medium">In Stock</span> : <span className="text-red-500 font-medium">Out of Stock</span> },
  { key: 'category', label: 'Category', fn: (p) => p.category || '-' },
  { key: 'description', label: 'Description', fn: (p) => <span className="text-xs leading-relaxed line-clamp-3">{p.description}</span> },
]

export default function Compare() {
  const { items, remove, clear, count } = useCompare()
  const { addItem } = useCart()
  const { toggleItem, isWishlisted } = useWishlist()

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Compare Products</h1>
            <p className="text-sm text-gray-500 mt-1">{count} of 4 products selected</p>
          </div>
          {count > 0 && (
            <button onClick={clear} className="text-sm font-semibold text-red-500 hover:text-red-600 flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-red-200 hover:border-red-300 transition-all">
              <FiTrash2 className="w-4 h-4" /> Clear All
            </button>
          )}
        </div>

        {count === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No products to compare</h2>
            <p className="text-gray-500 mb-6">Add products by clicking the compare icon on any product.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all">Browse Shop</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="w-40 p-3 text-left" />
                  {items.map(p => (
                    <th key={p.id} className="p-3 text-center min-w-[200px]">
                      <div className="relative">
                        <button onClick={() => remove(p.id)} className="absolute -top-2 -right-2 w-7 h-7 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-100 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 transition-all">
                          <FiX className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <Link to={`/product/${p.id}`} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-[#FF4F8B] transition-colors line-clamp-2">{p.name}</Link>
                        <div className="flex items-center justify-center gap-2 mt-3">
                          <button onClick={() => addItem(p)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white text-xs font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all">
                            <FiShoppingBag className="w-3.5 h-3.5" /> Add
                          </button>
                          <button onClick={() => toggleItem(p)} className={`p-2 rounded-xl border-2 transition-all ${isWishlisted(p.id) ? 'border-[#FF4F8B] bg-[#FF4F8B] text-white' : 'border-gray-200 dark:border-gray-700 hover:border-[#FF4F8B]'}`}>
                            <FiHeart className={`w-3.5 h-3.5 ${isWishlisted(p.id) ? 'fill-white' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specs.map(spec => (
                  <tr key={spec.key}>
                    <td className="p-3 text-sm font-semibold text-gray-700 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800">{spec.label}</td>
                    {items.map(p => (
                      <td key={p.id} className="p-3 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">{spec.fn(p)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
