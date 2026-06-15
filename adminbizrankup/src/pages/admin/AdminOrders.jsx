import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { AdminTable, AdminModal } from '../../components/admin/Shared'
import { FiEye } from 'react-icons/fi'

const statusColors = {
  Pending: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  Processing: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  Shipped: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  Delivered: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  Cancelled: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
}

const nextStatus = { Pending: 'Processing', Processing: 'Shipped', Shipped: 'Delivered', Delivered: null, Cancelled: null }

export default function AdminOrders() {
  const { orders, setOrders, updateItem } = useAdmin()
  const [search, setSearch] = useState('')
  const [viewing, setViewing] = useState(null)

  const filtered = orders.filter(o =>
    o.id?.toString().includes(search) ||
    o.customer?.toLowerCase()?.includes(search.toLowerCase()) ||
    o.status?.toLowerCase()?.includes(search.toLowerCase())
  )

  const advanceStatus = (order) => {
    const next = nextStatus[order.status]
    if (next) updateItem('orders', setOrders, order.id, { status: next })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Orders ({orders.length})</h1>
      </div>
      <AdminTable
        columns={[
          { key: 'id', label: 'Order ID', render: o => <span className="font-mono font-medium text-gray-900 dark:text-white">#{o.id}</span> },
          { key: 'customer', label: 'Customer' },
          { key: 'date', label: 'Date' },
          { key: 'total', label: 'Total', render: o => <span className="font-semibold">${o.total.toFixed(2)}</span> },
          { key: 'status', label: 'Status', render: o => (
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-lg ${statusColors[o.status] || statusColors.Pending}`}>{o.status || 'Pending'}</span>
              {nextStatus[o.status] && (
                <button onClick={() => advanceStatus(o)} className="text-[10px] text-[#FF4F8B] hover:underline font-medium">Advance</button>
              )}
            </div>
          )},
        ]}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        renderActions={o => (
          <button onClick={() => setViewing(o)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#FF4F8B] hover:bg-[#FF4F8B]/10 transition-all"><FiEye className="w-3.5 h-3.5" /></button>
        )}
      />
      <AdminModal open={!!viewing} onClose={() => setViewing(null)} title={`Order #${viewing?.id}`}>
        {viewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Customer</p>
                <p className="text-gray-900 dark:text-white">{viewing.customer}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Date</p>
                <p className="text-gray-900 dark:text-white">{viewing.date}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Status</p>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-lg ${statusColors[viewing.status] || statusColors.Pending}`}>{viewing.status}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">${viewing.total.toFixed(2)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</p>
              <div className="space-y-2">
                {viewing.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity || 1}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  )
}
