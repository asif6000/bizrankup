import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi'

export default function OrderSuccess() {
  const [orderNumber] = useState(() => String(Math.floor(Math.random() * 1000)).padStart(3, '0'))
  return (
    <Layout>
      <div className="max-w-lg mx-auto px-4 py-16 md:py-24 text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">Order Successful!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2">Thank you for your purchase.</p>
        <p className="text-sm text-gray-400 mb-8">Your order number is <span className="font-semibold text-gray-900 dark:text-white">ORD-2026-{orderNumber}</span></p>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <FiPackage className="w-4 h-4 text-[#FF4F8B]" />
            <span>You'll receive a confirmation email shortly</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/orders" className="px-8 py-3.5 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
            View Order <FiArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/" className="px-8 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:border-[#FF4F8B] hover:text-[#FF4F8B] transition-all">
            Continue Shopping
          </Link>
        </div>
      </div>
    </Layout>
  )
}
