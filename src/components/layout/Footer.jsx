import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiMapPin, FiPhone, FiClock, FiHeadphones, FiArrowRight, FiCheck } from 'react-icons/fi'
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP, FaTiktok } from 'react-icons/fa6'

const footerLinks = {
  shop: [
    { to: '/category/makeup', label: 'Makeup' },
    { to: '/category/skincare', label: 'Skincare' },
    { to: '/category/hair-care', label: 'Hair Care' },
    { to: '/category/fragrance', label: 'Fragrance' },
    { to: '/category/bath-body', label: 'Bath & Body' },
    { to: '/category/natural-organic', label: 'Natural & Organic' },
  ],
  support: [
    { to: '/contact', label: 'Contact Us' },
    { to: '/faq', label: 'FAQ' },
    { to: '/order-tracking', label: 'Order Tracking' },
    { to: '/customer-support', label: 'Customer Support' },
    { to: '/returns', label: 'Returns & Exchanges' },
    { to: '/shipping', label: 'Shipping Info' },
  ],
  company: [
    { to: '/about', label: 'About Us' },
    { to: '/blog', label: 'Blog' },
    { to: '/careers', label: 'Careers' },
    { to: '/press', label: 'Press' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
  ],
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF4F8B] to-[#7C3AED] rounded-xl flex items-center justify-center"><span className="text-white font-bold text-sm">B</span></div>
              <span className="font-bold text-xl text-white">BizRank</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">Your premium destination for luxury beauty and cosmetics. Discover curated collections from the world's finest brands.</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm"><FiMapPin className="w-4 h-4 text-[#FF4F8B] shrink-0" /><span>123 Beauty Avenue, New York, NY 10001</span></div>
              <div className="flex items-center gap-3 text-sm"><FiPhone className="w-4 h-4 text-[#FF4F8B] shrink-0" /><span>+1 (555) 123-4567</span></div>
              <div className="flex items-center gap-3 text-sm"><FiMail className="w-4 h-4 text-[#FF4F8B] shrink-0" /><span>hello@bizrankup.com</span></div>
            </div>
            <div className="flex gap-3 mt-6">
              {[
                { icon: FaFacebookF, href: '#', label: 'Facebook' },
                { icon: FaInstagram, href: '#', label: 'Instagram' },
                { icon: FaTwitter, href: '#', label: 'Twitter' },
                { icon: FaPinterestP, href: '#', label: 'Pinterest' },
                { icon: FaTiktok, href: '#', label: 'TikTok' },
              ].map(social => (
                <a key={social.label} href={social.href} className="w-10 h-10 bg-gray-800 hover:bg-[#FF4F8B] rounded-xl flex items-center justify-center transition-colors" title={social.label}>
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-white font-semibold text-sm mb-2">Subscribe to our newsletter</h3>
              <p className="text-gray-400 text-xs mb-3">Get 10% off your first order + weekly beauty tips.</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="flex-1 px-3 py-2.5 bg-gray-800 text-white text-sm rounded-xl outline-none focus:ring-2 focus:ring-[#FF4F8B]/50 placeholder:text-gray-500" />
                <button type="submit" className="px-4 py-2.5 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/25 active:scale-95 transition-all">
                  {subscribed ? <FiCheck className="w-4 h-4" /> : <FiArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>

          {Object.entries(footerLinks).map(([key, links]) => (
            <div key={key}>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{key === 'shop' ? 'Shop' : key === 'support' ? 'Support' : 'Company'}</h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-gray-400 hover:text-[#FF4F8B] transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
              {key === 'support' && (
                <div className="mt-4 pt-4 border-t border-gray-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500"><FiHeadphones className="w-3.5 h-3.5 text-[#FF4F8B]" /><span>24/7 Customer Support</span></div>
                  <div className="flex items-center gap-2 text-xs text-gray-500"><FiPhone className="w-3.5 h-3.5 text-[#FF4F8B]" /><span>+1 (555) 123-4567</span></div>
                  <div className="flex items-center gap-2 text-xs text-gray-500"><FiMail className="w-3.5 h-3.5 text-[#FF4F8B]" /><span>support@bizrankup.com</span></div>
                  <div className="flex items-center gap-2 text-xs text-gray-500"><FiClock className="w-3.5 h-3.5 text-[#FF4F8B]" /><span>Mon-Sat: 9AM - 10PM</span></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-800 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} BizRank. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link to="/shipping" className="hover:text-gray-300 transition-colors">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
