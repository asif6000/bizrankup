import { FiPackage, FiHeart, FiDollarSign, FiStar } from 'react-icons/fi'

const cards = [
  { icon: FiPackage, label: 'Total Orders', value: '12', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { icon: FiDollarSign, label: 'Total Spent', value: '$847.50', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { icon: FiHeart, label: 'Wishlist', value: '8', color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20' },
  { icon: FiStar, label: 'Reviews', value: '15', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
]

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(card => (
        <div key={card.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color} mb-3`}><card.icon className="w-5 h-5" /></div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
        </div>
      ))}
    </div>
  )
}
