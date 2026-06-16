import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import ProductGallery from '../components/product/ProductGallery'
import ProductVariantsSelector from '../components/product/ProductVariantsSelector'
import RatingsReviews from '../components/product/RatingsReviews'
import ReviewForm from '../components/product/ReviewForm'
import ProductCard from '../components/product/ProductCard'
import AddToCartButton from '../components/product/AddToCartButton'
import WishlistButton from '../components/product/WishlistButton'
import Rating from '../components/common/Rating'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useReview } from '../context/ReviewContext'
import { useData } from '../context/DataContext'
import { formatPrice, calculateDiscount } from '../utils/formatters'
import { FiChevronRight, FiTruck, FiRefreshCw, FiShield, FiCheck, FiX, FiShoppingBag, FiEdit3 } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa6'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, getProduct } = useData()
  const product = getProduct(id) || products.find(p => p.id === Number(id))
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const { items: recentlyViewed, add: addToRecentlyViewed } = useRecentlyViewed()
  const { addItem } = useCart()
  const { user } = useAuth()
  const { getProductReviews, getProductRating, addReview } = useReview()

  const productReviews = getProductReviews(product?.id || 0)
  const { avg: avgRating, count: reviewCount } = getProductRating(product?.id || 0)

  useEffect(() => {
    if (product) addToRecentlyViewed(product)
  }, [id, product, addToRecentlyViewed])

  if (!product) return <Layout><div className="text-center py-20"><p className="text-gray-400 text-lg">Product not found</p></div></Layout>

  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0
  const relatedProducts = products.filter(p => p.category.id === product.category.id && p.id !== product.id).slice(0, 4)
  const otherRecentlyViewed = recentlyViewed.filter(p => p.id !== product.id).slice(0, 4)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#FF4F8B]">Home</Link>
          <FiChevronRight className="w-3 h-3" />
          <Link to={`/category/${product.category.slug}`} className="hover:text-[#FF4F8B]">{product.category.name}</Link>
          <FiChevronRight className="w-3 h-3" />
          <span className="text-gray-900 dark:text-white font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-12">
          <ProductGallery images={product.images} />

          <div className="space-y-5">
            <div>
              <Link to={`/brand/${product.brand.slug}`} className="text-sm text-[#FF4F8B] font-medium hover:underline">{product.brand.name}</Link>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1">{product.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <Rating rating={avgRating || product.rating} size="sm" />
              <span className="text-sm text-gray-500">{reviewCount || product.reviewCount} reviews</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
              {product.originalPrice && <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>}
              {discount > 0 && <span className="text-sm font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-lg">Save {discount}%</span>}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>

            {product.inStock ? (
              <div className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-xl w-fit">
                <FiCheck className="w-4 h-4" /> In Stock
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl w-fit">
                <FiX className="w-4 h-4" /> Out of Stock
              </div>
            )}

            <ProductVariantsSelector variants={product.variants} selected={selectedVariant} onChange={setSelectedVariant} />

            <div className="flex items-center gap-3">
              <AddToCartButton product={product} variant={selectedVariant} size="lg" className="flex-1" />
              <WishlistButton product={product} size="lg" />
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => { addItem(product); navigate('/checkout') }} className="flex-1 text-center px-6 py-3 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white rounded-xl font-semibold text-sm hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <FiShoppingBag className="w-4 h-4" /> Buy Now
              </button>
              <a href={`https://wa.me/15551234567?text=Hi!%20I'm%20interested%20in%20${encodeURIComponent(product.name)}%20(${formatPrice(product.price)})`} target="_blank" rel="noopener noreferrer" className="px-4 py-3 bg-[#25D366] text-white rounded-xl font-semibold text-sm hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <FaWhatsapp className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              {[
                { icon: FiTruck, label: 'Free Shipping', desc: 'On orders over ৳2,000' },
                { icon: FiRefreshCw, label: 'Easy Returns', desc: '30-day return policy' },
                { icon: FiShield, label: 'Secure Checkout', desc: '100% protected' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <item.icon className="w-4 h-4 text-[#FF4F8B] shrink-0" />
                  <div><p className="font-medium text-gray-900 dark:text-white">{item.label}</p><p className="text-xs text-gray-500">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {product.ingredients && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Key Ingredients</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{product.ingredients}</p>
          </div>
        )}

        {product.howToUse && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">How to Use</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{product.howToUse}</p>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Customer Reviews</h2>
            {user && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white text-xs font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all"
              >
                <FiEdit3 className="w-3.5 h-3.5" /> Write a Review
              </button>
            )}
          </div>
          {showReviewForm && (
            <div className="mb-4">
              <ReviewForm
                productId={product.id}
                userName={user.name}
                userAvatar={user.avatar}
                onSubmit={(data) => { addReview({ ...data, userId: user.id, userName: user.name, userAvatar: user.avatar }); setShowReviewForm(false) }}
                onClose={() => setShowReviewForm(false)}
              />
            </div>
          )}
          <RatingsReviews reviews={productReviews} />
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>

        {otherRecentlyViewed.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {otherRecentlyViewed.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
