import { formatPrice } from '../../utils/formatters'

export default function OrderSummary({ subtotal, shipping = 0, discount = 0, couponDiscount = 0, showCheckout = true, onCheckout }) {
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax - discount - couponDiscount

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Order Summary</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Subtotal</span><span className="font-medium text-gray-900 dark:text-white">{formatPrice(subtotal)}</span></div>
        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Shipping</span><span className="font-medium text-gray-900 dark:text-white">{shipping === 0 ? <span className="text-green-600 font-semibold">Free</span> : formatPrice(shipping)}</span></div>
        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Tax (8%)</span><span className="font-medium text-gray-900 dark:text-white">{formatPrice(tax)}</span></div>
        {discount > 0 && <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Discount</span><span className="font-medium text-green-600">-{formatPrice(discount)}</span></div>}
        {couponDiscount > 0 && <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Coupon</span><span className="font-medium text-green-600">-{formatPrice(couponDiscount)}</span></div>}
        <hr className="border-gray-200 dark:border-gray-700" />
        <div className="flex justify-between text-base"><span className="font-semibold text-gray-900 dark:text-white">Total</span><span className="font-bold text-gray-900 dark:text-white">{formatPrice(total)}</span></div>
      </div>
      {showCheckout && (
        <button onClick={onCheckout} className="w-full mt-6 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 active:scale-[0.98] transition-all">
          Proceed to Checkout
        </button>
      )}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
        <span className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-[9px] font-bold">🔒</span> Secure checkout
      </div>
    </div>
  )
}
