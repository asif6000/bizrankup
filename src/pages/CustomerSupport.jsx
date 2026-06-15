import Layout from '../components/layout/Layout'
import { FiMail, FiMessageCircle, FiHeadphones, FiBook, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function CustomerSupport() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Customer Support</h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">We're here to help! Choose how you'd like to reach us.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: FiMessageCircle, title: 'Live Chat', desc: 'Chat with our team in real-time', action: 'Start Chat', highlight: true },
            { icon: FiMail, title: 'Email Support', desc: 'We reply within 24 hours', action: 'Send Email', href: 'mailto:support@bizrankup.com' },
            { icon: FiHeadphones, title: 'Phone Support', desc: 'Mon-Fri 9AM-6PM EST', action: 'Call Us', href: 'tel:+15551234567' },
            { icon: FiBook, title: 'Help Center', desc: 'Browse our knowledge base', action: 'Visit Help Center', to: '/faq' },
          ].map(item => (
            <div key={item.title} className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 ${item.highlight ? 'ring-2 ring-[#FF4F8B] shadow-lg shadow-pink-500/10' : ''}`}>
              <div className={`w-12 h-12 ${item.highlight ? 'bg-gradient-to-br from-[#FF4F8B] to-[#FF6B9D]' : 'bg-[#FF4F8B]/10'} rounded-xl flex items-center justify-center mb-4`}>
                <item.icon className={`w-5 h-5 ${item.highlight ? 'text-white' : 'text-[#FF4F8B]'}`} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{item.desc}</p>
              {item.to ? (
                <Link to={item.to} className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF4F8B] hover:underline">{item.action} <FiArrowRight className="w-3.5 h-3.5" /></Link>
              ) : (
                <a href={item.href} className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF4F8B] hover:underline">{item.action} <FiArrowRight className="w-3.5 h-3.5" /></a>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#FF4F8B]/10 to-[#7C3AED]/10 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Still Need Help?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Our support team is available 24/7 to assist you</p>
          <a href="mailto:support@bizrankup.com" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all">
            <FiMail className="w-4 h-4" /> support@bizrankup.com
          </a>
        </div>
      </div>
    </Layout>
  )
}
