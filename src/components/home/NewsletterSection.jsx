import { useState } from 'react'
import { FiSend, FiCheck } from 'react-icons/fi'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <section className="px-4 md:px-8 py-10 md:py-16">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF4F8B] via-[#FF4F8B] to-[#7C3AED] p-8 md:p-16">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-pink-300/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-white/10 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />

        <div className="relative z-10 text-center max-w-xl mx-auto">
          <div className="w-12 h-12 mx-auto mb-5 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <FiSend className="w-5 h-5 text-white -rotate-12" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">Join the Glow Club</h2>
          <p className="text-white/70 text-sm md:text-base mb-8 max-w-md mx-auto">
            Be the first to know about exclusive drops, beauty secrets, and members-only perks.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-5 py-3.5 rounded-xl text-sm text-gray-900 outline-none bg-white/95 backdrop-blur-sm placeholder:text-gray-400 focus:ring-2 focus:ring-white/50 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:scale-95 transition-all flex items-center gap-2 justify-center shadow-lg shadow-black/10"
            >
              {subscribed ? (
                <><FiCheck className="w-4 h-4" /> Subscribed!</>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
          <p className="text-white/40 text-[11px] mt-4">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  )
}
