import { useState, useEffect } from 'react'

export function useDebounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function useIntersectionObserver(options = {}) {
  const [ref, setRef] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(ref) }
    }, { threshold: 0.1, ...options })
    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, options])

  return [setRef, isVisible]
}
