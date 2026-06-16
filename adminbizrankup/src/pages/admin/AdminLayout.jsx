import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import LoginPage from './LoginPage'
import {
  FiPackage, FiTag, FiAward, FiShoppingBag, FiStar,
  FiFileText, FiPercent, FiImage, FiBell, FiMenu, FiX,
  FiBarChart2, FiHome, FiTruck, FiHelpCircle,
  FiZap, FiGitBranch, FiUsers, FiList, FiTrendingUp, FiMapPin, FiLayout, FiActivity, FiCpu, FiDollarSign, FiShoppingCart, FiSettings, FiShield, FiCalendar, FiAlertCircle, FiCreditCard,
} from 'react-icons/fi'

const navGroups = [
  {
    label: 'Main',
    items: [
      { to: '/', label: 'Dashboard', icon: FiBarChart2, exact: true },
      { to: '/events', label: 'Events', icon: FiCalendar },
      { to: '/users', label: 'Users', icon: FiUsers },
      { to: '/expenses', label: 'Expenses', icon: FiDollarSign },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/products', label: 'Products', icon: FiPackage },
      { to: '/categories', label: 'Categories', icon: FiTag },
      { to: '/brands', label: 'Brands', icon: FiAward },
    ],
  },
  {
    label: 'Sales',
    items: [
      { to: '/pos', label: 'POS', icon: FiShoppingCart },
      { to: '/orders', label: 'Orders', icon: FiShoppingBag },
      { to: '/incomplete-orders', label: 'Incomplete Orders', icon: FiAlertCircle },
      { to: '/offers', label: 'Offers & Coupons', icon: FiPercent },
      { to: '/flash-sales', label: 'Flash Sales', icon: FiZap },
      { to: '/bundles', label: 'Bundle Deals', icon: FiGitBranch },
      { to: '/addresses', label: 'Addresses', icon: FiMapPin },
    ],
  },
  {
    label: 'Payments',
    items: [
      { to: '/payment-gateways', label: 'Payment Gateway', icon: FiDollarSign },
      { to: '/advance-payment', label: 'Advance Payment', icon: FiCreditCard },
      { to: '/social-login', label: 'Social Login', icon: FiUsers },
    ],
  },
  {
    label: 'Shipping',
    items: [
      { to: '/shipping-rates', label: 'Shipping Rates', icon: FiTruck },
      { to: '/couriers', label: 'Courier Integration', icon: FiSettings },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/reviews', label: 'Reviews', icon: FiStar },
      { to: '/blog', label: 'Blog Posts', icon: FiFileText },
      { to: '/slides', label: 'Hero Slides', icon: FiImage },
      { to: '/notifications', label: 'Notifications', icon: FiBell },
      { to: '/faq', label: 'FAQ', icon: FiHelpCircle },
      { to: '/trending-stats', label: 'Trending Stats', icon: FiTrendingUp },
      { to: '/order-statuses', label: 'Order Statuses', icon: FiList },
      { to: '/header-footer', label: 'Header & Footer', icon: FiLayout },
    ],
  },

  {
    label: 'Security',
    items: [
      { to: '/fraud-checker', label: 'Fraud Checker', icon: FiShield },
    ],
  },
  {
    label: 'Automation',
    items: [
      { to: '/order-automation', label: 'Order Automation', icon: FiCpu },
    ],
  },
  {
    label: 'Integrations',
    items: [
      { to: '/tracking', label: 'Server-Side Tracking', icon: FiActivity },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/settings', label: 'Settings', icon: FiSettings },
    ],
  },
]

export default function AdminLayout() {
  const { isAuthenticated, authLoading, user, logout } = useAdmin()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#FF4F8B] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return <LoginPage />

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to
    return location.pathname.startsWith(item.to)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 dark:border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FF4F8B] to-[#7C3AED] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">Admin</p>
              <p className="text-[10px] text-gray-400">SHAJGOJ Panel</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"><FiX className="w-4 h-4" /></button>
        </div>
        <nav className="p-3 overflow-y-auto h-[calc(100vh-4rem)]">
          {navGroups.map(group => (
            <div key={group.label} className="mb-4">
              <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-1.5">{group.label}</p>
              {group.items.map(item => {
                const Icon = item.icon
                const active = isActive(item)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 ${
                      active
                        ? 'bg-gradient-to-r from-[#FF4F8B]/10 to-purple-500/10 text-[#FF4F8B] font-semibold'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#FF4F8B]' : ''}`} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}
          <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
            <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-all mb-0.5">
              <FiHome className="w-4 h-4" /> View Site
            </a>
          </div>
        </nav>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiMenu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
              <span className="text-gray-900 dark:text-white font-medium capitalize">
                {location.pathname === '/' ? 'Dashboard' : location.pathname.replace('/', '')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">{user?.email}</span>
            <button onClick={logout} className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors">Logout</button>
            <Link to="/settings" className="w-9 h-9 rounded-lg overflow-hidden bg-gradient-to-br from-[#FF4F8B] to-[#7C3AED] flex items-center justify-center hover:opacity-80 transition-opacity">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-xs">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
              )}
            </Link>
          </div>
        </header>
        <div className="p-4 md:p-6"><Outlet /></div>
      </div>
    </div>
  )
}
