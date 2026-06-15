import Layout from '../components/layout/Layout'
import { FiShield, FiLock, FiEye, FiTrash2 } from 'react-icons/fi'

export default function Privacy() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: January 1, 2026</p>
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {[
            { icon: FiShield, title: 'Data Protection', desc: 'Your personal data is encrypted using industry-standard SSL/TLS protocols.' },
            { icon: FiLock, title: 'Secure Payments', desc: 'We never store your payment details. All transactions are PCI-DSS compliant.' },
            { icon: FiEye, title: 'Your Control', desc: 'Access, update, or delete your data anytime from your account settings.' },
            { icon: FiTrash2, title: 'Data Retention', desc: 'We retain data only as long as necessary. You can request full deletion.' },
          ].map(item => (
            <div key={item.title} className="flex gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 bg-[#FF4F8B]/10 rounded-xl flex items-center justify-center shrink-0"><item.icon className="w-5 h-5 text-[#FF4F8B]" /></div>
              <div><h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p></div>
            </div>
          ))}
        </div>
        <div className="space-y-6 text-sm text-gray-600 dark:text-gray-400">
          <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Information We Collect</h2><p>We collect information you provide directly: name, email, shipping address, and payment details. We also automatically collect browsing data including IP address, device type, and page interactions to improve your experience.</p></div>
          <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How We Use Your Data</h2><p>Your data is used to process orders, personalize recommendations, send marketing communications (with consent), and analyze site performance. We never sell your personal information to third parties.</p></div>
          <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your Rights</h2><p>You have the right to access, correct, delete, or port your data. You can opt out of marketing anytime. Contact privacy@bizrankup.com for requests.</p></div>
          <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cookies</h2><p>We use essential and analytics cookies. You can manage preferences in your browser settings. Disabling cookies may affect site functionality.</p></div>
        </div>
      </div>
    </Layout>
  )
}
