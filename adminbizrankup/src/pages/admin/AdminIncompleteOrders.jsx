import { useState, useEffect } from 'react'
import { orders as ordersApi } from '../../api/client'
import { useAdmin } from '../../context/AdminContext'
import {
  FiShoppingBag, FiEye, FiShoppingCart, FiUser,
  FiAlertCircle, FiRefreshCw, FiSearch,
} from 'react-icons/fi'

const statusColors = {
  pending: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  cancelled: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
}

export default function AdminIncompleteOrders() {
  const { trackingEvents } = useAdmin()
  const [data, setData] = useState({ orders: [], activities: [] })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  const fetchData = async () => {
    try {
      const res = await ordersApi.incomplete()
      setData(res)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const groupedByUser = {}
  data.orders.forEach(o => {
    const key = o.user_id || 'guest_' + o.id
    if (!groupedByUser[key]) {
      groupedByUser[key] = {
        userId: o.user_id,
        customerName: o.customer_name || 'Guest',
        customerEmail: o.customer_email || '',
        customerPhone: o.customer_phone || '',
        orders: [],
        activities: [],
      }
    }
    groupedByUser[key].orders.push(o)
  })

  data.activities.forEach(a => {
    const key = a.user_id || 'guest'
    if (groupedByUser[key]) {
      groupedByUser[key].activities.push(a)
    }
  })

  const customers = Object.values(groupedByUser).filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.customerName?.toLowerCase().includes(q) ||
      c.customerEmail?.toLowerCase().includes(q) ||
      c.customerPhone?.toLowerCase().includes(q)
    )
  })

  const totalIncomplete = data.orders.length
  const totalPending = data.orders.filter(o => o.status === 'pending').length
  const totalCancelled = data.orders.filter(o => o.status === 'cancelled').length
  const totalCustomers = customers.length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Incomplete Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Customers with abandoned or incomplete orders</p>
        </div>
        <button onClick={fetchData} disabled={loading} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-60 transition-all">
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 uppercase font-semibold">Incomplete Orders</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalIncomplete}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <p className="text-xs text-gray-500 uppercase font-semibold">Pending</p>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-1">{totalPending}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <p className="text-xs text-gray-500 uppercase font-semibold">Cancelled</p>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-1">{totalCancelled}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 uppercase font-semibold">Customers</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalCustomers}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-4">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors"
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
          <div className="w-8 h-8 border-4 border-[#FF4F8B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading incomplete orders...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
          <FiShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No incomplete orders found.</p>
          <p className="text-xs text-gray-400 mt-1">All orders have been processed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {customers.map((customer, idx) => {
            const isExpanded = expanded === idx
            const pendingOrders = customer.orders.filter(o => o.status === 'pending')
            const viewActivities = customer.activities.filter(a => a.event_name === 'ViewContent')
            const cartActivities = customer.activities.filter(a => a.event_name === 'AddToCart')

            return (
              <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                {/* Customer Header */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : idx)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4F8B]/10 to-purple-500/10 flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-[#FF4F8B]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">{customer.customerName}</span>
                      {customer.orders.map(o => (
                        <span key={o.id} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-lg capitalize ${statusColors[o.status]}`}>{o.status}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      {customer.customerEmail && <span>{customer.customerEmail}</span>}
                      {customer.customerPhone && <span>{customer.customerPhone}</span>}
                      <span>{customer.orders.length} order{customer.orders.length > 1 ? 's' : ''}</span>
                      {viewActivities.length > 0 && <span>{viewActivities.length} views</span>}
                      {cartActivities.length > 0 && <span>{cartActivities.length} cart</span>}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {customer.orders.reduce((s, o) => s + Number(o.total), 0).toFixed(2)} ৳
                  </div>
                  <FiAlertCircle className={`w-4 h-4 text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800">
                    {/* Orders */}
                    <div className="p-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-1.5">
                        <FiShoppingBag className="w-3.5 h-3.5" /> Orders ({customer.orders.length})
                      </h4>
                      <div className="space-y-2">
                        {customer.orders.map(o => {
                          const items = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || [])
                          return (
                            <div key={o.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white font-mono">#{o.order_number}</span>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg capitalize ${statusColors[o.status]}`}>{o.status}</span>
                              </div>
                              <div className="space-y-1.5">
                                {items.map((item, i) => (
                                  <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-700 dark:text-gray-300 truncate">{item.name || item.product_name}</span>
                                    <span className="text-gray-500 shrink-0 ml-2">
                                      ৳{Number(item.price).toFixed(2)} x {item.quantity || 1}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString()}</span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">Total: ৳{Number(o.total).toFixed(2)}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Product Views */}
                    {viewActivities.length > 0 && (
                      <div className="p-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-1.5">
                          <FiEye className="w-3.5 h-3.5" /> Products Viewed ({viewActivities.length})
                        </h4>
                        <div className="space-y-1.5">
                          {viewActivities.slice(0, 10).map((a, i) => {
                            const ed = typeof a.event_data === 'string' ? JSON.parse(a.event_data) : (a.event_data || {})
                            return (
                              <div key={i} className="flex items-center gap-3 text-sm p-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                                <FiEye className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                <span className="flex-1 text-gray-700 dark:text-gray-300 truncate">{ed.product_name || ed.content_name || ed.product_id || 'Unknown'}</span>
                                {ed.price && <span className="text-xs text-gray-400">৳{ed.price}</span>}
                                <span className="text-[10px] text-gray-400">{new Date(a.created_at).toLocaleTimeString()}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Add to Cart */}
                    {cartActivities.length > 0 && (
                      <div className="p-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-1.5">
                          <FiShoppingCart className="w-3.5 h-3.5" /> Added to Cart ({cartActivities.length})
                        </h4>
                        <div className="space-y-1.5">
                          {cartActivities.map((a, i) => {
                            const ed = typeof a.event_data === 'string' ? JSON.parse(a.event_data) : (a.event_data || {})
                            return (
                              <div key={i} className="flex items-center gap-3 text-sm p-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                                <FiShoppingCart className="w-3.5 h-3.5 text-[#FF4F8B] shrink-0" />
                                <span className="flex-1 text-gray-700 dark:text-gray-300 truncate">{ed.product_name || ed.content_name || ed.product_id || 'Unknown'}</span>
                                {ed.price && <span className="text-xs text-gray-400">৳{ed.price}</span>}
                                {ed.quantity && <span className="text-xs text-gray-400">x{ed.quantity}</span>}
                                <span className="text-[10px] text-gray-400">{new Date(a.created_at).toLocaleTimeString()}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* No Activity */}
                    {viewActivities.length === 0 && cartActivities.length === 0 && (
                      <div className="p-4 text-center text-xs text-gray-400">
                        <FiEye className="w-5 h-5 mx-auto mb-1 text-gray-300" />
                        No tracking activity for this customer
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
