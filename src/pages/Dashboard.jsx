import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import UserProfileCard from '../components/user/UserProfileCard'
import DashboardCards from '../components/user/DashboardCards'
import { useAuth } from '../context/AuthContext'
import { FiGrid, FiUser, FiMapPin, FiPackage, FiStar, FiBell, FiLogOut, FiChevronRight } from 'react-icons/fi'

const sidebarLinks = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/profile', icon: FiUser, label: 'Profile' },
  { to: '/addresses', icon: FiMapPin, label: 'Addresses' },
  { to: '/orders', icon: FiPackage, label: 'Orders' },
  { to: '/reviews', icon: FiStar, label: 'Reviews' },
  { to: '/notifications', icon: FiBell, label: 'Notifications' },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) { navigate('/login'); return null }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">My Account</h1>
        <div className="grid md:grid-cols-4 gap-8">
          <aside className="hidden md:block space-y-1">
            {sidebarLinks.map(link => (
              <Link key={link.to} to={link.to} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#FF4F8B] transition-all">
                <link.icon className="w-4 h-4" />{link.label}
              </Link>
            ))}
            <hr className="my-3 border-gray-100 dark:border-gray-800" />
            <button onClick={() => { logout(); navigate('/login') }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-all">
              <FiLogOut className="w-4 h-4" />Sign Out
            </button>
          </aside>
          <main className="md:col-span-3 space-y-6">
            <UserProfileCard user={user} />
            <DashboardCards />
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {['ORD-2026-001', 'ORD-2026-002'].map(id => (
                  <Link key={id} to="/orders" className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div><p className="text-sm font-medium text-gray-900 dark:text-white">{id}</p><p className="text-xs text-gray-500">May 28, 2026</p></div>
                    <div className="flex items-center gap-3"><span className="text-xs px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg font-medium">Delivered</span><FiChevronRight className="w-4 h-4 text-gray-400" /></div>
                  </Link>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  )
}
