import { useState, useEffect } from 'react'
import { FiSearch, FiPlus, FiMinus, FiTrash2, FiDollarSign, FiShoppingCart, FiX } from 'react-icons/fi'
import { useAdmin } from '../../context/AdminContext'

export default function AdminPOS() {
  const { products, orders, setOrders } = useAdmin()
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('')
  const [payment, setPayment] = useState('cod')
  const [showReceipt, setShowReceipt] = useState(false)
  const [lastOrder, setLastOrder] = useState(null)

  const categories = [...new Set(products.map(p => p.category?.name || 'Uncategorized'))]

  const filtered = products.filter(p =>
    p.inStock !== false &&
    (p.name?.toLowerCase().includes(search.toLowerCase()) || '') &&
    (!selectedCat || p.category?.name === selectedCat)
  )

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const cartItems = cart.reduce((s, i) => s + i.qty, 0)

  const addToCart = (product) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === product.id)
      if (exist) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, image: product.image }]
    })
  }

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0))
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  const placeOrder = () => {
    if (cart.length === 0) return
    const order = {
      id: Date.now(),
      customer: 'POS (Walk-in)',
      date: new Date().toISOString().split('T')[0],
      total: cartTotal,
      status: 'Delivered',
      payment,
      items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.qty })),
    }
    setOrders(prev => [order, ...prev])
    setLastOrder(order)
    setShowReceipt(true)
    setCart([])
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Products */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            <button onClick={() => setSelectedCat('')} className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!selectedCat ? 'bg-[#FF4F8B] text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500'}`}>All</button>
            {categories.map(c => (
              <button key={c} onClick={() => setSelectedCat(c)} className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCat === c ? 'bg-[#FF4F8B] text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500'}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 content-start">
          {filtered.map(p => (
            <button key={p.id} onClick={() => addToCart(p)} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3 text-left hover:border-[#FF4F8B] hover:shadow-md transition-all active:scale-[0.97]">
              <img src={p.image} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{p.name}</p>
              <p className="text-sm font-bold text-[#FF4F8B] mt-0.5">${p.price.toFixed(2)}</p>
              {p.badge && <span className="text-[9px] font-semibold text-white bg-[#FF4F8B] px-1.5 py-0.5 rounded mt-1 inline-block">{p.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="w-80 shrink-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b border-gray-100 dark:border-gray-800">
          <FiShoppingCart className="w-4 h-4 text-[#FF4F8B]" />
          <span className="font-bold text-sm text-gray-900 dark:text-white">Cart</span>
          <span className="text-xs text-gray-400 ml-auto">{cartItems} items</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-10">
              <FiShoppingCart className="w-10 h-10 text-gray-200 dark:text-gray-700 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Cart is empty</p>
              <p className="text-[10px] text-gray-300">Click products to add</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                  <p className="text-xs font-bold text-[#FF4F8B]">${(item.price * item.qty).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 hover:bg-gray-300"><FiMinus className="w-3 h-3" /></button>
                  <span className="w-6 text-center text-xs font-semibold text-gray-900 dark:text-white">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 hover:bg-gray-300"><FiPlus className="w-3 h-3" /></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><FiX className="w-3 h-3" /></button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-bold text-gray-900 dark:text-white">${cartTotal.toFixed(2)}</span>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Payment</label>
            <select value={payment} onChange={e => setPayment(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-[#FF4F8B] transition-colors">
              <option value="cod">Cash on Delivery</option>
              <option value="card">Credit Card</option>
              <option value="mobile">Mobile Payment</option>
            </select>
          </div>
          <button onClick={placeOrder} disabled={cart.length === 0} className="w-full py-3 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white text-sm font-bold rounded-xl hover:from-[#e64579] hover:to-[#e64579] active:scale-[0.97] transition-all disabled:opacity-50 shadow-lg shadow-pink-500/25">
            Place Order — ${cartTotal.toFixed(2)}
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && lastOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowReceipt(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-80 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <FiShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Order Complete</h3>
              <p className="text-xs text-gray-400 mt-1">Order #{lastOrder.id}</p>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-1.5">
              {lastOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">{item.name} x{item.quantity}</span>
                  <span className="font-medium text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
              <span className="text-sm font-bold text-gray-900 dark:text-white">Total</span>
              <span className="text-sm font-bold text-[#FF4F8B]">${lastOrder.total.toFixed(2)}</span>
            </div>
            <button onClick={() => setShowReceipt(false)} className="w-full mt-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
