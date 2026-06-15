import Layout from '../components/layout/Layout'
import { FiBookOpen, FiAward, FiGlobe, FiUsers } from 'react-icons/fi'

const articles = [
  { title: 'BizRank Named Top Beauty Retailer 2026', date: 'Mar 15, 2026', source: 'Forbes' },
  { title: 'How BizRank is Revolutionizing Clean Beauty', date: 'Feb 28, 2026', source: 'Vogue Business' },
  { title: 'Our Journey to Carbon Neutral Shipping', date: 'Jan 10, 2026', source: 'Sustainability Today' },
  { title: 'Behind the Scenes: Our Curation Process', date: 'Dec 5, 2025', source: 'Elle Beauty' },
]

export default function Press() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Press & Media</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Latest news, features, and announcements.</p>
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {[
            { icon: FiBookOpen, title: 'Media Kit', desc: 'Download our brand assets, logos, and press photos.' },
            { icon: FiAward, title: 'Awards', desc: 'Winner of Best Beauty E-Commerce 2026 & Innovation in Retail.' },
            { icon: FiGlobe, title: 'In the News', desc: 'Featured in Forbes, Vogue, Elle, and 20+ publications.' },
            { icon: FiUsers, title: 'Spokesperson', desc: 'Contact our PR team for interview requests and commentary.' },
          ].map(item => (
            <div key={item.title} className="flex gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 bg-[#FF4F8B]/10 rounded-xl flex items-center justify-center shrink-0"><item.icon className="w-5 h-5 text-[#FF4F8B]" /></div>
              <div><h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p></div>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Press Coverage</h2>
        <div className="space-y-3">
          {articles.map(a => (
            <div key={a.title} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <div><p className="font-semibold text-gray-900 dark:text-white">{a.title}</p><p className="text-xs text-gray-500">{a.source} &middot; {a.date}</p></div>
              <button className="text-sm font-semibold text-[#FF4F8B] hover:text-[#d63d6e] shrink-0">Read</button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
