import Layout from '../components/layout/Layout'
import { FiShield, FiHeart, FiAward, FiUsers, FiTarget, FiGlobe } from 'react-icons/fi'

const values = [
  { icon: FiHeart, title: 'Cruelty-Free Beauty', desc: 'We are committed to ethical beauty. Every product we sell is 100% cruelty-free.' },
  { icon: FiAward, title: 'Premium Quality', desc: 'We curate only the finest products from the world\'s most trusted beauty brands.' },
  { icon: FiShield, title: 'Safe & Clean', desc: 'All products undergo rigorous safety testing and meet the highest quality standards.' },
  { icon: FiUsers, title: 'Community First', desc: 'We build a community of beauty enthusiasts who share, learn, and grow together.' },
  { icon: FiTarget, title: 'Innovation Driven', desc: 'We stay ahead of beauty trends to bring you the latest and most innovative products.' },
  { icon: FiGlobe, title: 'Sustainable Future', desc: 'We\'re committed to reducing our environmental footprint through sustainable practices.' },
]

export default function AboutUs() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-12 mt-6">
          <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
            <div className="px-8 md:px-16">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Story</h1>
              <p className="text-white/80 max-w-lg">Redefining beauty since 2025</p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to BizRank</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            At BizRank, we believe that beauty is more than skin deep. Founded in 2025, we set out to create a beauty destination that celebrates diversity, promotes self-expression, and makes premium beauty accessible to everyone.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Our team of beauty experts scours the globe to bring you the most innovative, high-quality products from both established luxury brands and emerging indie labels. We're proud to be a cruelty-free platform that champions clean beauty and sustainability.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {values.map(v => (
            <div key={v.title} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#FF4F8B]/10 rounded-xl flex items-center justify-center mb-4"><v.icon className="w-5 h-5 text-[#FF4F8B]" /></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#FF4F8B] to-[#7C3AED] rounded-2xl p-8 md:p-12 text-center text-white mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-white/80 max-w-lg mx-auto mb-6">Be part of a growing community of beauty lovers. Follow us on social media for the latest trends, tips, and exclusive offers.</p>
          <div className="flex justify-center gap-3">
            {['Instagram', 'Facebook', 'Twitter', 'Pinterest'].map(s => (
              <a key={s} href="#" className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl text-sm font-semibold transition-all">{s}</a>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { value: '10K+', label: 'Products' },
            { value: '500+', label: 'Brands' },
            { value: '50K+', label: 'Happy Customers' },
            { value: '4.8', label: 'Average Rating' },
          ].map(stat => (
            <div key={stat.label} className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <p className="text-3xl md:text-4xl font-bold text-[#FF4F8B]">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
