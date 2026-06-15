import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import { orders } from '../data'
import { FiPackage, FiChevronRight } from 'react-icons/fi'

const statusColors = {
  Delivered: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
  Shipped: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
  Processing: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
  Pending: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
}

export default function OrderHistory() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) { navigate('/login'); return null }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Order History</h1>

        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map(order => (
              <Link key={order.id} to="/order-tracking" className="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{order.id}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-3 py-1 rounded-lg ${statusColors[order.status]}`}>{order.status}</span>
                    <FiChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{order.items} item{order.items > 1 ? 's' : ''}</span>
                  <span className="font-bold text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
                </div>
                {order.tracking && <p className="text-xs text-gray-400 mt-2">Tracking: {order.tracking}</p>}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4"><FiPackage className="w-6 h-6 text-gray-300" /></div>
            <p className="text-gray-500">No orders yet</p>
            <Link to="/" className="inline-flex items-center gap-2 mt-4 text-[#FF4F8B] font-semibold hover:underline">Start Shopping</Link>
          </div>
        )}
      </div>
    </Layout>
  )
}
