import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { heroSlides } from '../../data'

export default function HeroBannerSlider() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent(prev => (prev + 1) % heroSlides.length), [])
  const prev = useCallback(() => setCurrent(prev => (prev - 1 + heroSlides.length) % heroSlides.length), [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const slide = heroSlides[current]

  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 md:mx-8 mt-4 md:mt-6">
      <div className={`relative h-[300px] md:h-[500px] bg-gradient-to-r ${slide.bg} flex items-center`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        <img src={slide.image} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" />

        <div className="relative z-10 px-8 md:px-16 max-w-xl">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">{slide.title}</h1>
          <p className="text-base md:text-lg text-white/90 mb-8">{slide.subtitle}</p>
          <Link to="/category/makeup" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">
            {slide.cta}
            <FiChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center transition-all"><FiChevronLeft className="w-5 h-5 text-white" /></button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center transition-all"><FiChevronRight className="w-5 h-5 text-white" /></button>

      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${i === current ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'}`} />
        ))}
      </div>
    </section>
  )
}
