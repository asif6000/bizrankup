import { Link } from 'react-router-dom'
import { FiX, FiShoppingBag, FiTrash2 } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatters'
import QuantitySelector from '../common/QuantitySelector'

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, totalItems, subtotal } = useCart()

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      <div
        className={`fixed top-0 right-0 bottom-0 z-[71] w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <FiShoppingBag className="w-5 h-5 text-[#FF4F8B]" />
            <span className="font-semibold text-gray-900 dark:text-white">Shopping Cart</span>
            <span className="text-sm text-gray-400">({totalItems} items)</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <FiShoppingBag className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add some products to get started</p>
            </div>
          ) : (
            items.map(item => (
              <div key={`${item.id}-${item.variant?.name || ''}`} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <Link to={`/product/${item.id}`} className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700" onClick={() => setIsOpen(false)}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <Link to={`/product/${item.id}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-[#FF4F8B] transition-colors line-clamp-1" onClick={() => setIsOpen(false)}>
                      {item.name}
                    </Link>
                    <button onClick={() => removeItem(item.id, item.variant?.name)} className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {item.variant && <p className="text-xs text-gray-400">{item.variant.name}</p>}
                  <div className="flex items-center justify-between mt-2">
                    <QuantitySelector value={item.quantity} onChange={q => updateQuantity(item.id, item.variant?.name, q)} size="sm" />
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-800 p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
              <span className="font-bold text-gray-900 dark:text-white text-base">{formatPrice(subtotal)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setIsOpen(false)}
              className="block w-full py-3 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white text-sm font-semibold rounded-xl text-center hover:shadow-lg hover:shadow-pink-500/25 active:scale-[0.98] transition-all"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="block w-full py-2.5 text-sm text-gray-500 dark:text-gray-400 text-center hover:text-[#FF4F8B] transition-colors"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
