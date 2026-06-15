import { useAdmin } from '../../context/AdminContext'
import { FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp } from 'react-icons/fi'
import { StatCard } from '../../components/admin/Shared'

export default function AdminDashboard() {
  const { products, orders, categories, brands } = useAdmin()

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FiPackage} label="Total Products" value={products.length} color="text-[#FF4F8B]" bg="bg-[#FF4F8B]/10" />
        <StatCard icon={FiShoppingBag} label="Total Orders" value={orders.length} color="text-purple-500" bg="bg-purple-50 dark:bg-purple-500/10" sub={`${deliveredOrders} delivered`} />
        <StatCard icon={FiDollarSign} label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} color="text-emerald-500" bg="bg-emerald-50 dark:bg-emerald-500/10" />
        <StatCard icon={FiTrendingUp} label="Brands" value={brands.length} color="text-blue-500" bg="bg-blue-50 dark:bg-blue-500/10" />
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase">Order</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-3 py-2.5 text-[11px] font-semibold text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                  <td className="px-3 py-3 font-medium text-gray-900 dark:text-white">{order.id}</td>
                  <td className="px-3 py-3 text-gray-500">{order.date}</td>
                  <td className="px-3 py-3">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-lg ${
                      order.status === 'Delivered' ? 'bg-green-50 dark:bg-green-900/20 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700' :
                      order.status === 'Processing' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-600'
                    }`}>{order.status}</span>
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
