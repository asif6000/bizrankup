import { useMemo } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp, FiUsers, FiClock } from 'react-icons/fi'

function Sparkline({ data, color = '#FF4F8B', height = 32, width = 80 }) {
  if (!data.length) return null
  const max = Math.max(...data, 1)
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - (v / max) * height}`).join(' ')
  return (
    <svg width={width} height={height} className="shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#grad-${color.replace('#', '')})`} />
    </svg>
  )
}

function BarChart({ data, height = 160, color = '#FF4F8B' }) {
  if (!data.length) return null
  const max = Math.max(...data.map(d => d.value), 1)
  const barW = Math.max(8, Math.min(24, (100 / data.length) * 0.6))
  return (
    <svg width="100%" height={height} className="overflow-visible">
      {data.map((d, i) => {
        const barH = (d.value / max) * (height - 20)
        const x = (i / data.length) * 100 + (100 / data.length - barW) / 2
        return (
          <g key={i}>
            <rect x={`${x}%`} y={height - 10 - barH} width={barW} height={barH} rx="3" fill={color} opacity="0.8" className="hover:opacity-100 transition-opacity">
              <title>{d.label}: ${d.value.toFixed(2)}</title>
            </rect>
            <text x={`${x + barW / 2}%`} y={height - 4} textAnchor="middle" fill="#9ca3af" fontSize="8">{d.label?.slice(0, 3)}</text>
          </g>
        )
      })}
    </svg>
  )
}

function DonutChart({ data, size = 160 }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const cx = size / 2, cy = size / 2, r = size / 2 - 16
  const colors = ['#FF4F8B', '#7C3AED', '#F59E0B', '#10B981', '#3B82F6', '#6B7280']
  let offset = 0
  return (
    <svg width={size} height={size} className="shrink-0">
      {data.map((d, i) => {
        const pct = d.value / total
        const angle = pct * 360
        const startAngle = (offset * 360) - 90
        const endAngle = (offset * 360 + angle) - 90
        const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180)
        const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180)
        const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180)
        const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180)
        const largeArc = angle > 180 ? 1 : 0
        const path = angle >= 360
          ? `M${cx},${cy - r} A${r},${r} 0 1,1 ${cx - 0.01},${cy - r}`
          : `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`
        offset += pct
        return <path key={i} d={path} fill={colors[i % colors.length]} opacity="0.85" />
      })}
      <circle cx={cx} cy={cy} r={r * 0.55} fill="white" className="dark:fill-gray-900" />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#111827" fontSize="18" fontWeight="bold" className="dark:fill-white">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#9ca3af" fontSize="9">Total</text>
    </svg>
  )
}

function TrendingStat({ icon: Icon, label, value, trend, color, bg, sparkData }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            <FiTrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} /> {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      {sparkData && <div className="mt-2"><Sparkline data={sparkData} color={color.replace('text-', '#')} /></div>}
    </div>
  )
}

export default function AdminDashboard() {
  const { products, orders, categories, brands, users } = useAdmin()

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length
  const pendingOrders = orders.filter(o => o.status === 'Pending').length
  const processingOrders = orders.filter(o => o.status === 'Processing').length

  const monthlyRevenue = useMemo(() => {
    const map = {}
    orders.forEach(o => {
      const m = o.date?.slice(0, 7) || 'unknown'
      map[m] = (map[m] || 0) + o.total
    })
    return Object.entries(map).sort().slice(-7).map(([k, v]) => ({ label: k, value: v }))
  }, [orders])

  const statusDist = useMemo(() => {
    const map = {}
    orders.forEach(o => { map[o.status] = (map[o.status] || 0) + 1 })
    return Object.entries(map).map(([k, v]) => ({ label: k, value: v }))
  }, [orders])

  const weeklyOrders = useMemo(() => {
    const map = {}
    orders.forEach(o => {
      const d = o.date || ''
      map[d] = (map[d] || 0) + 1
    })
    return Object.entries(map).sort().slice(-7).map(([k, v]) => ({ label: k.slice(5), value: v }))
  }, [orders])

  const revenueTrend = monthlyRevenue.map(m => m.value)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Your business overview</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <FiClock className="w-3.5 h-3.5" />
          <span>{orders.length} orders · {products.length} products</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <TrendingStat icon={FiShoppingBag} label="Total Orders" value={orders.length} color="text-[#FF4F8B]" bg="bg-[#FF4F8B]/10" trend={12} sparkData={weeklyOrders.map(w => w.value)} />
        <TrendingStat icon={FiDollarSign} label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} color="text-emerald-500" bg="bg-emerald-50 dark:bg-emerald-500/10" trend={8} sparkData={revenueTrend} />
        <TrendingStat icon={FiPackage} label="Products" value={products.length} color="text-purple-500" bg="bg-purple-50 dark:bg-purple-500/10" />
        <TrendingStat icon={FiUsers} label="Customers" value={users?.length || 0} color="text-blue-500" bg="bg-blue-50 dark:bg-blue-500/10" trend={-3} />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white">Revenue</h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF4F8B]" /> Monthly</span>
              <span className="text-gray-400">${totalRevenue.toFixed(2)} total</span>
            </div>
          </div>
          <div className="h-40">
            {monthlyRevenue.length > 0 ? <BarChart data={monthlyRevenue} /> : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">No revenue data yet</div>
            )}
          </div>
        </div>

        {/* Order Status Donut */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Order Status</h2>
          <div className="flex items-center gap-4">
            <DonutChart data={statusDist} />
            <div className="flex-1 space-y-2">
              {statusDist.map((d, i) => {
                const colors = ['#FF4F8B', '#7C3AED', '#F59E0B', '#10B981', '#3B82F6', '#6B7280']
                return (
                  <div key={d.label} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                    <span className="text-xs text-gray-500 flex-1">{d.label}</span>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">{d.value}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-100 dark:border-amber-900/30">
          <p className="text-2xl font-bold text-amber-600">{pendingOrders}</p>
          <p className="text-xs text-amber-500 mt-0.5">Pending</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
          <p className="text-2xl font-bold text-blue-600">{processingOrders}</p>
          <p className="text-xs text-blue-500 mt-0.5">Processing</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-4 border border-purple-100 dark:border-purple-900/30">
          <p className="text-2xl font-bold text-purple-600">{orders.filter(o => o.status === 'Shipped').length}</p>
          <p className="text-xs text-purple-500 mt-0.5">Shipped</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-4 border border-green-100 dark:border-green-900/30">
          <p className="text-2xl font-bold text-green-600">{deliveredOrders}</p>
          <p className="text-xs text-green-500 mt-0.5">Delivered</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white">Recent Orders</h2>
          <span className="text-xs text-gray-400">Last 5 orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase">Order</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase">Customer</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-3 py-3 font-medium text-gray-900 dark:text-white font-mono text-xs">#{order.id}</td>
                  <td className="px-3 py-3 text-gray-600 dark:text-gray-400">{order.customer || '—'}</td>
                  <td className="px-3 py-3 text-gray-500">{order.date}</td>
                  <td className="px-3 py-3">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-lg ${
                      order.status === 'Delivered' ? 'bg-green-50 dark:bg-green-900/20 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700' :
                      order.status === 'Processing' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700' :
                      order.status === 'Pending' ? 'bg-gray-100 dark:bg-gray-700 text-gray-600' :
                      'bg-red-50 dark:bg-red-900/20 text-red-600'
                    }`}>{order.status}</span>
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-sm text-gray-400">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
