import Layout from '../components/layout/Layout'
import { FiTruck, FiPackage, FiGlobe, FiClock } from 'react-icons/fi'

export default function Shipping() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Shipping Information</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Fast, reliable shipping to your doorstep.</p>
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {[
            { icon: FiTruck, title: 'Standard Shipping', desc: 'Free on orders over $50. Delivered in 5-7 business days. Otherwise $4.99.' },
            { icon: FiPackage, title: 'Express Shipping', desc: 'Upgraded to 2-3 business days for $12.99. Same-day dispatch on orders before 12 PM.' },
            { icon: FiGlobe, title: 'International Shipping', desc: 'Available to 40+ countries. Rates calculated at checkout. Delivery in 10-14 business days.' },
            { icon: FiClock, title: 'Order Tracking', desc: 'Real-time tracking updates via email and SMS. Track from our Order Tracking page.' },
          ].map(item => (
            <div key={item.title} className="flex gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 bg-[#FF4F8B]/10 rounded-xl flex items-center justify-center shrink-0"><item.icon className="w-5 h-5 text-[#FF4F8B]" /></div>
              <div><h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p></div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Shipping Policy</h2>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc pl-5">
            <li>Orders are processed within 1-2 business days.</li>
            <li>Free standard shipping on all orders over $50.</li>
            <li>Express orders placed by 12 PM EST ship same day.</li>
            <li>We are not responsible for customs fees on international orders.</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}
