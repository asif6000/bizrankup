import { Link } from 'react-router-dom'
import { FiTrash2 } from 'react-icons/fi'
import { formatPrice } from '../../utils/formatters'
import QuantitySelector from '../common/QuantitySelector'
import LazyImage from '../common/LazyImage'

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
      <Link to={`/product/${item.id}`} className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
        <LazyImage src={item.image} alt={item.name} className="w-full h-full" />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.brand?.name}</p>
            <Link to={`/product/${item.id}`} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-[#FF4F8B] transition-colors line-clamp-1">{item.name}</Link>
            {item.variant && <p className="text-xs text-gray-400 mt-0.5">Size: {item.variant.name}</p>}
          </div>
          <button onClick={() => onRemove(item.id, item.variant?.name)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors shrink-0"><FiTrash2 className="w-4 h-4" /></button>
        </div>
        <div className="flex items-center justify-between mt-3">
          <QuantitySelector value={item.quantity} onChange={q => onUpdateQuantity(item.id, item.variant?.name, q)} size="sm" />
          <span className="font-bold text-sm md:text-base text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>
    </div>
  )
}
