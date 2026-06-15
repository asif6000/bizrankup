import { useState, useEffect } from 'react'
import { FiArrowUp } from 'react-icons/fi'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 w-11 h-11 bg-gradient-to-br from-[#FF4F8B] to-[#7C3AED] text-white rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center hover:shadow-xl hover:scale-105 active:scale-95 transition-all animate-fade-in"
      title="Back to top"
    >
      <FiArrowUp className="w-5 h-5" />
    </button>
  )
}
