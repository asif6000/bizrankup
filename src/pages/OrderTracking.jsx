import { useState } from 'react'
import Layout from '../components/layout/Layout'
import { orderStatuses } from '../data'
import { FiPackage, FiCheck, FiTruck, FiBox } from 'react-icons/fi'

const icons = [FiPackage, FiCheck, FiBox, FiTruck, FiTruck, FiCheck]

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('ORD-2026-001')
  const [tracked, setTracked] = useState(false)

  const handleTrack = () => { if (orderId.trim()) setTracked(true) }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Track Your Order</h1>
        <p className="text-sm text-gray-500 mb-8">Enter your order number to track your package</p>

        <div className="flex gap-3 mb-10">
          <input value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="e.g. ORD-2026-001" className="flex-1 px-5 py-3.5 bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-[#FF4F8B] rounded-xl text-sm outline-none transition-colors" onKeyDown={e => e.key === 'Enter' && handleTrack()} />
          <button onClick={handleTrack} className="px-8 py-3.5 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all">Track</button>
        </div>

        {tracked && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Order #{orderId}</h2>
                <p className="text-sm text-gray-500">Estimated delivery: Jun 6-8, 2026</p>
              </div>
              <span className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg text-sm font-medium">In Transit</span>
            </div>

            <div className="relative">
              {orderStatuses.map((status, i) => {
                const Icon = icons[i]
                return (
                  <div key={status.label} className="flex gap-4 pb-8 last:pb-0 relative">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center relative z-10 ${status.completed ? 'bg-[#FF4F8B] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {i < orderStatuses.length - 1 && <div className={`w-0.5 flex-1 ${status.completed ? 'bg-[#FF4F8B]' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                    </div>
                    <div className="flex-1 pt-1.5">
                      <p className={`font-semibold text-sm ${status.completed ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{status.label}</p>
                      {status.date && <p className="text-xs text-gray-500 mt-0.5">{status.date}</p>}
                    </div>
                    {status.completed && <FiCheck className="w-4 h-4 text-green-500 mt-2" />}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
