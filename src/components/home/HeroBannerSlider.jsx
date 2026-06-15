import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight, FiArrowDown } from 'react-icons/fi'
import { heroSlides } from '../../data'

export default function HeroBannerSlider() {
  const [current, setCurrent] = useState(0)
  const [prevSlide, setPrevSlide] = useState(null)
  const [animating, setAnimating] = useState(false)
  const animTimer = useRef()

  useEffect(() => () => clearTimeout(animTimer.current), [])

  const goTo = useCallback((i) => {
    if (animating || i === current) return
    setAnimating(true)
    setPrevSlide(current)
    clearTimeout(animTimer.current)
    animTimer.current = setTimeout(() => {
      setCurrent(i)
      setPrevSlide(null)
      setAnimating(false)
    }, 600)
  }, [current, animating])

  const next = useCallback(() => goTo((current + 1) % heroSlides.length), [current, goTo])
  const prev = useCallback(() => goTo((current - 1 + heroSlides.length) % heroSlides.length), [current, goTo])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="group/slider relative overflow-hidden rounded-2xl mx-4 md:mx-8 mt-4 md:mt-6">
      <div className="relative h-[320px] md:h-[520px]">
        {heroSlides.map((slide, i) => {
          const isActive = i === current
          const isLeaving = i === prevSlide

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                isActive
                  ? 'opacity-100 scale-100'
                  : isLeaving
                  ? 'opacity-0 scale-[1.03]'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className={`w-full h-full bg-gradient-to-r ${slide.bg} relative`}>
                <div className="absolute inset-0 bg-black/15" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
                <img
                  src={slide.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
                />

                <div className="absolute inset-0 flex items-center">
                  <div className="relative z-10 px-8 md:px-16 max-w-xl">
                    <span className={`inline-block px-3 py-1 bg-white/15 backdrop-blur-sm text-white text-[10px] font-semibold rounded-full mb-4 tracking-wider uppercase ${isActive ? 'animate-fade-in' : ''}`}>
                      New Collection
                    </span>
                    <h1 className={`text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight ${isActive ? 'animate-slide-up' : ''}`}>
                      {slide.title}
                    </h1>
                    <p className={`text-base md:text-lg text-white/80 mb-8 max-w-md ${isActive ? 'animate-slide-up' : ''}`} style={{ animationDelay: isActive ? '0.1s' : '0s' }}>
                      {slide.subtitle}
                    </p>
                    <Link
                      to="/category/makeup"
                      className={`inline-flex items-center gap-2.5 bg-white text-gray-900 px-8 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:shadow-black/10 hover:scale-[1.03] active:scale-95 transition-all duration-300 ${isActive ? 'animate-slide-up' : ''}`}
                      style={{ animationDelay: isActive ? '0.2s' : '0s' }}
                    >
                      {slide.cta}
                      <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center">
                        <FiChevronRight className="w-3 h-3" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md hover:bg-white/25 rounded-full flex items-center justify-center transition-all opacity-0 hover:opacity-100 group-hover/slider:opacity-100 border border-white/10">
        <FiChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md hover:bg-white/25 rounded-full flex items-center justify-center transition-all opacity-0 hover:opacity-100 border border-white/10">
        <FiChevronRight className="w-5 h-5 text-white" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="group relative h-1.5 rounded-full overflow-hidden transition-all duration-500"
            style={{ width: i === current ? '40px' : '6px' }}
          >
            <span className={`absolute inset-0 rounded-full transition-all duration-500 ${i === current ? 'bg-white' : 'bg-white/40 group-hover:bg-white/70'}`} />
            {i === current && (
              <span className="absolute inset-0 rounded-full bg-white/50 animate-pulse" style={{ animationDuration: '6s' }} />
            )}
          </button>
        ))}
      </div>

      <div className="hidden md:flex absolute bottom-6 right-8 items-center gap-2 text-white/40 text-[10px] tracking-widest uppercase">
        <span className="font-semibold text-white/70 text-sm">{String(current + 1).padStart(2, '0')}</span>
        <span className="w-6 h-px bg-white/30" />
        <span className="text-white/40 text-sm">{String(heroSlides.length).padStart(2, '0')}</span>
      </div>

      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5 text-white/30 animate-bounce">
        <span className="text-[8px] tracking-[0.2em] uppercase">Scroll</span>
        <FiArrowDown className="w-3.5 h-3.5" />
      </div>
    </section>
  )
}
