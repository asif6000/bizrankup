import { FiPackage, FiTag, FiHeart, FiStar } from 'react-icons/fi'

const icons = { order: FiPackage, offer: FiTag, wishlist: FiHeart, review: FiStar }

export default function NotificationCards({ notifications, onMarkRead }) {
  if (!notifications.length) return <div className="text-center py-12 text-gray-400">No notifications yet</div>

  return (
    <div className="space-y-2">
      {notifications.map(n => {
        const Icon = icons[n.type] || FiPackage
        return (
          <div key={n.id} className={`flex items-start gap-3 p-4 rounded-2xl transition-colors cursor-pointer ${n.read ? 'bg-white dark:bg-gray-800' : 'bg-pink-50 dark:bg-pink-900/10'} border border-gray-100 dark:border-gray-700`} onClick={() => !n.read && onMarkRead?.(n.id)}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.read ? 'bg-gray-100 dark:bg-gray-700 text-gray-400' : 'bg-[#FF4F8B]/10 text-[#FF4F8B]'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${n.read ? 'text-gray-600 dark:text-gray-400' : 'font-semibold text-gray-900 dark:text-white'}`}>{n.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
              <span className="text-[11px] text-gray-400 mt-1 block">{n.time}</span>
            </div>
            {!n.read && <span className="w-2 h-2 bg-[#FF4F8B] rounded-full shrink-0 mt-2" />}
          </div>
        )
      })}
    </div>
  )
}
