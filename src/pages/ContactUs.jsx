import { useState } from 'react'
import Layout from '../components/layout/Layout'
import { FiMail, FiMapPin, FiPhone, FiClock, FiSend, FiCheck } from 'react-icons/fi'

export default function ContactUs() {
  const [sent, setSent] = useState(false)
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Get in Touch</h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">We'd love to hear from you. Drop us a message and we'll get back to you within 24 hours.</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            {[
              { icon: FiMail, label: 'Email', value: 'hello@bizrankup.com', desc: 'We reply within 24 hours' },
              { icon: FiPhone, label: 'Phone', value: '+1 (555) 123-4567', desc: 'Mon-Fri 9AM-6PM EST' },
              { icon: FiMapPin, label: 'Visit Us', value: '123 Beauty Avenue', desc: 'New York, NY 10001' },
              { icon: FiClock, label: 'Business Hours', value: 'Mon - Sat: 9AM - 8PM', desc: 'Sunday: 10AM - 6PM' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-[#FF4F8B]/10 rounded-xl flex items-center justify-center shrink-0"><item.icon className="w-5 h-5 text-[#FF4F8B]" /></div>
                <div><h3 className="font-semibold text-gray-900 dark:text-white">{item.label}</h3><p className="text-sm text-gray-900 dark:text-white">{item.value}</p><p className="text-xs text-gray-500">{item.desc}</p></div>
              </div>
            ))}
          </div>

          <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center"><FiCheck className="w-8 h-8 text-green-600" /></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Message Sent!</h3>
                <p className="text-sm text-gray-500 mt-1">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Name</label>
                  <input required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <input type="email" required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                <input required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                <textarea rows={5} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors resize-none" />
              </div>
              <button type="submit" className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all">
                <FiSend className="w-4 h-4" /> Send Message
              </button>
            </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
