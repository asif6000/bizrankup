import { useState } from 'react'
import { FiCreditCard, FiDollarSign, FiSmartphone } from 'react-icons/fi'
import { FaPaypal } from 'react-icons/fa6'

const paymentMethods = [
  { value: 'card', label: 'Credit Card', icon: FiCreditCard },
  { value: 'paypal', label: 'PayPal', icon: FaPaypal },
  { value: 'apple-pay', label: 'Apple Pay', icon: FiSmartphone },
  { value: 'google-pay', label: 'Google Pay', icon: FiCreditCard },
  { value: 'cod', label: 'Cash on Delivery', icon: FiDollarSign },
]

export default function CheckoutForm({ onSubmit }) {
  const [payment, setPayment] = useState('card')

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit?.() }} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Shipping Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label><input required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label><input type="email" required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label><input required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label><input required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City</label><input required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Zip Code</label><input required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" /></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Payment Method</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {paymentMethods.map(method => {
            const Icon = method.icon
            const active = payment === method.value
            return (
              <button key={method.value} type="button" onClick={() => setPayment(method.value)} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${active ? 'border-[#FF4F8B] bg-pink-50 dark:bg-pink-900/10 text-[#FF4F8B]' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}>
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium leading-tight text-center">{method.label}</span>
              </button>
            )
          })}
        </div>
        {payment === 'card' && (
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Card Number</label><input placeholder="4242 4242 4242 4242" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Expiry</label><input placeholder="MM/YY" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">CVC</label><input placeholder="123" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" /></div>
          </div>
        )}
        {payment === 'cod' && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-700 dark:text-amber-300 font-medium flex items-center gap-2">
              <FiDollarSign className="w-4 h-4" /> Pay with cash upon delivery
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">No extra charges. Pay when your order arrives.</p>
          </div>
        )}
      </div>

      <button type="submit" className="w-full bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-pink-500/25 active:scale-[0.98] transition-all">
        Place Order
      </button>
    </form>
  )
}
