import Layout from '../components/layout/Layout'
import { FiBriefcase, FiHeart, FiTrendingUp, FiUsers } from 'react-icons/fi'

const openings = [
  { title: 'Senior React Developer', type: 'Full-time', dept: 'Engineering' },
  { title: 'UX/UI Designer', type: 'Full-time', dept: 'Design' },
  { title: 'Digital Marketing Manager', type: 'Full-time', dept: 'Marketing' },
  { title: 'Customer Support Lead', type: 'Remote', dept: 'Support' },
]

export default function Careers() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Join Our Team</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Help us redefine the beauty experience.</p>
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {[
            { icon: FiBriefcase, title: 'Growth Opportunities', desc: 'We invest in your professional development with learning budgets and mentorship.' },
            { icon: FiHeart, title: 'Great Culture', desc: 'Remote-first culture with flexible hours, generous PTO, and team retreats.' },
            { icon: FiTrendingUp, title: 'Competitive Pay', desc: 'Top-of-market salary, equity packages, and performance bonuses.' },
            { icon: FiUsers, title: 'Diverse Team', desc: 'We celebrate diversity and create an inclusive environment for everyone.' },
          ].map(item => (
            <div key={item.title} className="flex gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 bg-[#FF4F8B]/10 rounded-xl flex items-center justify-center shrink-0"><item.icon className="w-5 h-5 text-[#FF4F8B]" /></div>
              <div><h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p></div>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Open Positions</h2>
        <div className="space-y-3">
          {openings.map(job => (
            <div key={job.title} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
              <div><p className="font-semibold text-gray-900 dark:text-white">{job.title}</p><p className="text-xs text-gray-500">{job.dept} &middot; {job.type}</p></div>
              <button className="px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#d63d6e] active:scale-95 transition-all">Apply</button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
