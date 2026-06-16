import { useState } from 'react'
import Layout from '../components/layout/Layout'
import { useData } from '../context/DataContext'
import { FiChevronDown, FiSearch } from 'react-icons/fi'

function FAQItem({ item, open, onToggle }) {
  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
        <span className="font-medium text-gray-900 dark:text-white text-sm md:text-base pr-4">{item.question}</span>
        <FiChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
        <p className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-white dark:bg-gray-800">{item.answer}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const { faqData } = useData()
  const [openId, setOpenId] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = faqData.filter(item =>
    item.question.toLowerCase().includes(search.toLowerCase()) ||
    item.answer.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-sm text-gray-500">Everything you need to know about shopping at BizRank</p>
        </div>

        <div className="relative max-w-md mx-auto mb-8">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search FAQ..." className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-[#FF4F8B] rounded-xl text-sm outline-none transition-colors" />
        </div>

        <div className="space-y-3">
          {filtered.map(item => (
            <FAQItem key={item.id} item={item} open={openId === item.id} onToggle={() => setOpenId(openId === item.id ? null : item.id)} />
          ))}
        </div>

        {filtered.length === 0 && <p className="text-center text-gray-400 py-8">No matching questions found.</p>}

        <div className="text-center mt-10 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
          <p className="text-gray-600 dark:text-gray-400 mb-3">Still have questions?</p>
          <a href="mailto:support@bizrankup.com" className="inline-flex items-center gap-2 text-[#FF4F8B] font-semibold hover:underline">Contact Support</a>
        </div>
      </div>
    </Layout>
  )
}
