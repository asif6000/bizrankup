import { useState, useEffect, useRef } from 'react'
import { FiCreditCard, FiDollarSign, FiSmartphone, FiMapPin } from 'react-icons/fi'
import { FaPaypal } from 'react-icons/fa6'

const DRAFT_KEY = 'shajgoj_checkout_draft'

const paymentMethods = [
  { value: 'card', label: 'Credit Card', icon: FiCreditCard },
  { value: 'paypal', label: 'PayPal', icon: FaPaypal },
  { value: 'apple-pay', label: 'Apple Pay', icon: FiSmartphone },
  { value: 'google-pay', label: 'Google Pay', icon: FiCreditCard },
  { value: 'cod', label: 'Cash on Delivery', icon: FiDollarSign },
]

const divisions = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh']

const defaultForm = {
  fullname: '', phone: '', email: '', address: '',
  division: '', district: '', area: '', zip: '', payment_method: 'cod',
}

function loadDraft() {
  try {
    const saved = localStorage.getItem(DRAFT_KEY)
    return saved ? { ...defaultForm, ...JSON.parse(saved) } : null
  } catch { return null }
}

function saveDraft(data) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)) } catch { /* ignore */ }
}

export function clearCheckoutDraft() {
  try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
}

export function getCheckoutDraft() {
  return loadDraft()
}

export default function CheckoutForm({ onSubmit }) {
  const [form, setForm] = useState(() => loadDraft() || defaultForm)
  const [payment, setPayment] = useState(form.payment_method || 'cod')
  const saveTimer = useRef(null)
  const initialSaveDone = useRef(false)

  useEffect(() => {
    if (!initialSaveDone.current) {
      initialSaveDone.current = true
      return
    }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveDraft({ ...form, payment_method: payment }), 500)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [form, payment])

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.set(k, v))
    fd.set('payment_method', payment)
    onSubmit?.(fd)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiMapPin className="w-5 h-5 text-[#FF4F8B]" />
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Shipping Address</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <input name="fullname" value={form.fullname} onChange={set('fullname')} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
            <input name="phone" type="tel" value={form.phone} onChange={set('phone')} required placeholder="+8801XXXXXXXXX" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <input type="email" name="email" value={form.email} onChange={set('email')} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Street Address</label>
            <input name="address" value={form.address} onChange={set('address')} required placeholder="House, road, area" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Division</label>
            <select name="division" value={form.division} onChange={set('division')} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors">
              <option value="">Select Division</option>
              {divisions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">District</label>
            <input name="district" value={form.district} onChange={set('district')} required placeholder="e.g. Dhaka" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Area / Thana</label>
            <input name="area" value={form.area} onChange={set('area')} required placeholder="e.g. Mirpur" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Post Code</label>
            <input name="zip" value={form.zip} onChange={set('zip')} required placeholder="e.g. 1216" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
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

      <input type="hidden" name="payment_method" value={payment} />
      <button type="submit" className="w-full bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-pink-500/25 active:scale-[0.98] transition-all">
        Place Order
      </button>
    </form>
  )
}
