import { useState } from 'react'
import { FiGift, FiCheck, FiX } from 'react-icons/fi'

export default function CouponSystem() {
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState(null)
  const [error, setError] = useState('')

  const applyCoupon = () => {
    if (!code.trim()) return
    if (code.toUpperCase() === 'WELCOME20') { setApplied({ code: 'WELCOME20', discount: 20 }); setError('') }
    else if (code.toUpperCase() === 'SUMMER40') { setApplied({ code: 'SUMMER40', discount: 40 }); setError('') }
    else { setError('Invalid coupon code'); setApplied(null) }
  }

  const removeCoupon = () => { setApplied(null); setCode('') }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FiGift className="w-4 h-4 text-[#FF4F8B]" /> Apply Coupon</h3>
      {applied ? (
        <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <FiCheck className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">"{applied.code}" applied ({applied.discount}% off)</span>
          </div>
          <button onClick={removeCoupon} className="p-1 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg"><FiX className="w-4 h-4 text-green-600" /></button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="Enter coupon code" className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" onKeyDown={e => e.key === 'Enter' && applyCoupon()} />
          <button onClick={applyCoupon} className="px-5 py-2.5 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">Apply</button>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  )
}
