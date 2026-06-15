import Layout from '../components/layout/Layout'
import { FiRefreshCw, FiShield, FiClock, FiMail } from 'react-icons/fi'

export default function Returns() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Returns & Exchanges</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Hassle-free returns within 30 days of delivery.</p>
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {[
            { icon: FiRefreshCw, title: 'Easy Returns', desc: 'Initiate a return from your account. Print the prepaid label and drop off at any partner location.' },
            { icon: FiShield, title: 'Money-Back Guarantee', desc: 'Full refund within 5-7 business days after we receive your return.' },
            { icon: FiClock, title: '30-Day Window', desc: 'You have 30 days from delivery to initiate a return for any reason.' },
            { icon: FiMail, title: 'Contact Us', desc: 'Need help? Our support team is available 24/7 to assist with your return.' },
          ].map(item => (
            <div key={item.title} className="flex gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 bg-[#FF4F8B]/10 rounded-xl flex items-center justify-center shrink-0"><item.icon className="w-5 h-5 text-[#FF4F8B]" /></div>
              <div><h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p></div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Return Policy</h2>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc pl-5">
            <li>Items must be unused and in original packaging.</li>
            <li>Free returns on defective or incorrect items.</li>
            <li>A $5.99 shipping fee applies for change-of-mind returns.</li>
            <li>Final sale items cannot be returned.</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}
