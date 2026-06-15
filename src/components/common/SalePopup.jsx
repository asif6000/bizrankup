import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../../data'
import { formatPrice } from '../../utils/formatters'
import { FiX } from 'react-icons/fi'

const messages = [
  'just purchased',
  'bought',
  'added to cart',
  'is loving',
]

const names = [
  'Sarah M.', 'Jessica K.', 'Emma L.', 'Olivia R.', 'Sophia C.',
  'Ava W.', 'Mia J.', 'Charlotte B.', 'Amelia H.', 'Harper P.',
  'Ella D.', 'Grace F.', 'Chloe G.', 'Lily V.', 'Zoey N.',
]

export default function SalePopup() {
  const [item, setItem] = useState(null)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const hideTimer = useRef()
  const showNext = useCallback(() => {
    const product = products[Math.floor(Math.random() * products.length)]
    const name = names[Math.floor(Math.random() * names.length)]
    const msg = messages[Math.floor(Math.random() * messages.length)]
    setItem({ product, name, msg })
    setVisible(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setVisible(false), 5000)
  }, [])

  useEffect(() => {
    if (dismissed) return
    const t1 = setTimeout(showNext, 3000)
    const interval = setInterval(showNext, 12000)
    return () => { clearTimeout(t1); clearInterval(interval); clearTimeout(hideTimer.current) }
  }, [dismissed])

  if (!item || !visible || dismissed) return null

  return (
    <div className="fixed bottom-24 md:bottom-6 left-4 md:left-6 z-40 max-w-[340px] animate-slide-up">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-3.5">
        <Link to={`/product/${item.product.id}`} className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
          <img src={item.product.image} alt="" className="w-full h-full object-cover" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
            <span className="font-semibold text-gray-900 dark:text-white">{item.name}</span>{' '}
            {item.msg}{' '}
            <Link to={`/product/${item.product.id}`} className="text-[#FF4F8B] hover:underline font-semibold">{item.product.name}</Link>
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(item.product.price)}</span>
            <span className="text-[10px] text-gray-400">a few seconds ago</span>
          </div>
        </div>
        <button onClick={() => { setVisible(false); setDismissed(true) }} className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-100 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 transition-all">
          <FiX className="w-3 h-3 text-gray-400" />
        </button>
      </div>
    </div>
  )
}
