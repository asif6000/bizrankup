import { useState, useEffect, useRef } from 'react'
import ProductCard from '../product/ProductCard'
import { flashSales } from '../../data'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

function usePerSlide() {
  const [perSlide, setPerSlide] = useState(2)
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w >= 1024) setPerSlide(6)
      else if (w >= 640) setPerSlide(4)
      else setPerSlide(2)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return perSlide
}

export default function FlashSaleSection() {
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 })
  const intervalRef = useRef()
  const perSlide = usePerSlide()
  const maxIndexRef = useRef()

  const totalSlides = Math.ceil(flashSales.length / perSlide)
  const maxIndex = totalSlides - 1
  maxIndexRef.current = maxIndex

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.h === 0 && prev.m === 0 && prev.s === 0) clearInterval(timer)
        const total = prev.h * 3600 + prev.m * 60 + prev.s - 1
        if (total <= 0) return { h: 0, m: 0, s: 0 }
        return { h: Math.floor(total / 3600), m: Math.floor((total % 3600) / 60), s: total % 60 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev >= maxIndexRef.current ? 0 : prev + 1))
    }, 4000)
    return () => clearInterval(intervalRef.current)
  }, [maxIndex])

  useEffect(() => {
    if (current > maxIndex) setCurrent(0)
  }, [perSlide])

  const goTo = (i) => setCurrent(Math.max(0, Math.min(i, maxIndex)))

  return (
    <section className="px-4 md:px-8 py-4 md:py-8">
      <div className="bg-gradient-to-br from-rose-600 via-pink-500 to-purple-600 rounded-2xl p-4 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-300/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
        <div className="relative z-10 flex flex-row items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-9 md:h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-sm md:text-lg shrink-0">⚡</div>
            <div className="min-w-0">
              <h2 className="text-sm md:text-xl lg:text-2xl font-bold text-white truncate">Flash Sale</h2>
              <p className="text-pink-200 text-[10px] md:text-xs mt-0.5 hidden sm:block">Limited time offers — grab them fast!</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {Object.entries(timeLeft).map(([key, val]) => (
              <div key={key} className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-1.5 py-1 min-w-[1.8rem] md:min-w-[2.2rem]">
                  <span className="text-xs md:text-lg font-bold text-white">{String(val).padStart(2, '0')}</span>
                </div>
                <span className="text-[6px] md:text-[8px] text-pink-200 uppercase mt-0.5 block">{key}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative group">
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * (100 / perSlide)}%)` }}
            >
              {flashSales.map(product => (
                <div key={product.id} style={{ minWidth: `${100 / perSlide}%` }} className="p-0.5 md:p-1">
                  <ProductCard product={product} flash compact />
                </div>
              ))}
            </div>
          </div>

          {totalSlides > 1 && (
            <>
              <button onClick={() => goTo(current - 1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-7 h-7 md:w-9 md:h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                <FiChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-gray-800" />
              </button>
              <button onClick={() => goTo(current + 1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-7 h-7 md:w-9 md:h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                <FiChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-800" />
              </button>
            </>
          )}

          {totalSlides > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-3 md:mt-4">
              {Array.from({ length: totalSlides }, (_, i) => (
                <button key={i} onClick={() => goTo(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-4 md:w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
