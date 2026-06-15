import { useState, useEffect, useRef } from 'react'
import { FiHeart, FiPackage, FiAward, FiStar } from 'react-icons/fi'

const stats = [
  { icon: FiHeart, value: 500, suffix: '+', label: 'Happy Customers', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  { icon: FiPackage, value: 10, suffix: 'K+', label: 'Orders Delivered', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { icon: FiAward, value: 50, suffix: '+', label: 'Premium Brands', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { icon: FiStar, value: 48, suffix: '', label: 'Avg Rating (4.8)', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
]

function AnimatedCounter({ target, suffix, visible }) {
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!visible || started.current) return
    started.current = true
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target, visible])

  return <>{count}{suffix}</>
}

export default function TrendingStatsBar() {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="px-4 md:px-8 py-6 md:py-8">
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 md:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${i * 150}ms` }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} visible={visible} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
