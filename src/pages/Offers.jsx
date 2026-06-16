import Layout from '../components/layout/Layout'
import { useData } from '../context/DataContext'
import { FiClock, FiCopy, FiCheck } from 'react-icons/fi'
import { useState } from 'react'

function OfferCard({ offer }) {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard?.writeText(offer.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`bg-gradient-to-r ${offer.bg} rounded-2xl p-6 md:p-8 text-white relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="relative z-10">
        <h3 className="text-xl md:text-2xl font-bold mb-2">{offer.title}</h3>
        <p className="text-white/80 text-sm mb-4">{offer.description}</p>
        <div className="flex items-center gap-2 mb-4">
          <FiClock className="w-4 h-4 text-white/70" />
          <span className="text-xs text-white/70">Valid until {offer.validUntil}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-xl font-mono font-bold text-lg tracking-wider">{offer.code}</div>
          <button onClick={copyCode} className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
            {copied ? <><FiCheck className="w-4 h-4" /> Copied</> : <><FiCopy className="w-4 h-4" /> Copy</>}
          </button>
        </div>
        {offer.discount > 0 && (
          <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-lg text-sm font-bold">
            {offer.discount}% OFF
          </div>
        )}
      </div>
    </div>
  )
}

export default function Offers() {
  const { offers } = useData()
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Offers & Promotions</h1>
        <p className="text-sm text-gray-500 mb-8">Exclusive deals and coupons just for you</p>
        <div className="grid md:grid-cols-2 gap-6">
          {offers.map(offer => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </Layout>
  )
}
