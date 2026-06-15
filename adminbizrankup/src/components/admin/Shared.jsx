import { FiSearch, FiX } from 'react-icons/fi'

export function AdminTable({ columns, data, renderActions, searchPlaceholder = 'Search...', searchQuery, onSearchChange }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      {onSearchChange && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="relative max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-8 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors"
            />
            {searchQuery && (
              <button onClick={() => onSearchChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50">
              {columns.map(col => (
                <th key={col.key} className={`text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider ${col.width ? `w-${col.width}` : ''}`}>
                  {col.label}
                </th>
              ))}
              {renderActions && <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-24">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {data.length === 0 ? (
              <tr><td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-4 py-12 text-center text-gray-400">No data found</td></tr>
            ) : (
              data.map((row, i) => (
                <tr key={row.id || i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {renderActions && <td className="px-4 py-3 text-right">{renderActions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminModal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <FiX className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirm Delete', message = 'Are you sure? This cannot be undone.' }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 animate-scale-in">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <FiX className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-500 mb-5">{message}</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button onClick={() => { onConfirm(); onClose() }} className="px-5 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 active:scale-95 transition-all">Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function StatCard({ icon: Icon, label, value, sub, color = 'text-[#FF4F8B]', bg = 'bg-[#FF4F8B]/10' }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}
