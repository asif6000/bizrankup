import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Layout from '../components/layout/Layout'
import CheckoutForm from '../components/checkout/CheckoutForm'
import OrderSummary from '../components/checkout/OrderSummary'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = () => {
    setProcessing(true)
    setTimeout(() => {
      clearCart()
      navigate('/order-success')
    }, 2000)
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Checkout</h1>
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-3">
            <CheckoutForm onSubmit={handleSubmit} />
            {processing && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-2xl">
                  <div className="w-16 h-16 border-4 border-[#FF4F8B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">Processing your order...</p>
                  <p className="text-sm text-gray-500 mt-1">Please wait a moment</p>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            <OrderSummary subtotal={subtotal} showCheckout={false} />
            <div className="mt-4 space-y-3">
              {items.map(item => (
                <div key={`${item.id}-${item.variant?.name}`} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
