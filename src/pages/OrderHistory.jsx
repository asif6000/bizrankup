import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import { orders as ordersApi } from '../api/client'
import { FiPackage, FiChevronRight, FiEdit3, FiClock, FiRefreshCw, FiTruck, FiCheckCircle } from 'react-icons/fi'

const statusConfig = {
  Pending: {
    color: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700',
    badge: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    icon: FiClock,
    message: 'Your order is pending.',
    sub: 'We\'ll confirm it shortly.',
    bar: 'bg-gray-200 dark:bg-gray-600',
  },
  Processing: {
    color: 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    icon: FiRefreshCw,
    message: 'We\'re preparing your order.',
    sub: 'Our team is packing it with care.',
    bar: 'bg-amber-400',
  },
  Shipped: {
    color: 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30',
    badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    icon: FiTruck,
    message: 'Your order is on its way!',
    sub: 'Track your delivery for real-time updates.',
    bar: 'bg-blue-400',
  },
  Delivered: {
    color: 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30',
    badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    icon: FiCheckCircle,
    message: 'Your order has been delivered.',
    sub: 'We hope you love your products!',
    bar: 'bg-green-400',
  },
}

export default function OrderHistory() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [apiOrders, setApiOrders] = useState([])

  useEffect(() => {
    ordersApi.list({}).then(data => {
      const list = Array.isArray(data) ? data : (data.orders || data.data || [])
      if (list.length > 0) setApiOrders(list)
    }).catch(() => {})
  }, [])

  if (!user) { navigate('/login'); return null }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Order History</h1>

        {apiOrders.length > 0 ? (
          <div className="space-y-4">
            {apiOrders.map(order => {
              const cfg = statusConfig[order.status] || statusConfig.Pending
              const Icon = cfg.icon

              return (
                <div key={order.id} className={`rounded-2xl border p-5 transition-all hover:shadow-md ${cfg.color}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.badge}`}>
                        <Icon className={`w-5 h-5 ${order.status === 'Processing' ? 'animate-spin' : ''}`} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{order.id}</p>
                        <p className="text-[11px] text-gray-500">{order.date}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${cfg.badge}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{cfg.message}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{cfg.sub}</p>
                  </div>

                  <div className="w-full h-1.5 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden mb-4">
                    <div className={`h-full rounded-full transition-all duration-1000 ${cfg.bar}`}
                      style={{ width: order.status === 'Delivered' ? '100%' : order.status === 'Shipped' ? '75%' : order.status === 'Processing' ? '40%' : '15%' }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-500">{order.items} item{order.items > 1 ? 's' : ''}</span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="font-bold text-gray-900 dark:text-white">৳{order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to="/order-tracking" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#FF4F8B]/30 hover:text-[#FF4F8B] transition-all">
                        Track <FiChevronRight className="w-3 h-3" />
                      </Link>
                      {order.status === 'Delivered' && (
                        <Link to="/shop" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] rounded-lg hover:shadow-lg active:scale-95 transition-all">
                          <FiEdit3 className="w-3 h-3" /> Review
                        </Link>
                      )}
                    </div>
                  </div>

                  {order.tracking && (
                    <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/30">
                      <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                        <FiTruck className="w-3 h-3" /> Tracking: <span className="font-mono text-gray-500">{order.tracking}</span>
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No orders yet</p>
            <p className="text-sm text-gray-400 mt-1">Start shopping and your orders will appear here</p>
            <Link to="/" className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white text-sm font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </Layout>
  )
}
