import { useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import NotificationCards from '../components/user/NotificationCards'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { FiCheck } from 'react-icons/fi'

export default function NotificationCenter() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { notifications, markAsRead, markAllAsRead } = useNotifications()

  if (!user) { navigate('/login'); return null }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">Stay updated with your orders and offers</p>
          </div>
          <button onClick={markAllAsRead} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#FF4F8B] bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
            <FiCheck className="w-4 h-4" /> Mark All Read
          </button>
        </div>
        <NotificationCards notifications={notifications} onMarkRead={markAsRead} />
      </div>
    </Layout>
  )
}
