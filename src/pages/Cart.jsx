import { useNavigate, Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import CartItem from '../components/cart/CartItem'
import CouponSystem from '../components/cart/CouponSystem'
import OrderSummary from '../components/checkout/OrderSummary'
import { useCart } from '../context/CartContext'
import { FiShoppingBag } from 'react-icons/fi'

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <Layout>
        <div className="text-center py-20 max-w-7xl mx-auto px-4">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShoppingBag className="w-8 h-8 text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all">Start Shopping</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Shopping Cart ({items.length} items)</h1>
        <div className="space-y-4">
          {items.map(item => (
            <CartItem key={`${item.id}-${item.variant?.name || ''}`} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
          ))}
          <CouponSystem />
          <div className="pt-4">
            <OrderSummary subtotal={subtotal} onCheckout={() => navigate('/checkout')} />
          </div>
        </div>
      </div>
    </Layout>
  )
}
