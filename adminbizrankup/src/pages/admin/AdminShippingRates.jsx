import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiSave, FiCheck, FiTruck } from 'react-icons/fi'

const STORAGE_KEY = 'shajgoj_admin_shipping_rates'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}

export default function AdminShippingRates() {
  const [rates, setRates] = useState(load)
  const [showForm, setShowForm] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ name: '', amount: '', deliveryDays: '', minOrder: '' })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rates))
  }, [rates])

  const addRate = () => {
    if (!form.name || !form.amount) return
    setRates(prev => [...prev, { id: Date.now(), ...form, amount: parseFloat(form.amount), minOrder: form.minOrder ? parseFloat(form.minOrder) : 0, deliveryDays: form.deliveryDays || '3-5' }])
    setForm({ name: '', amount: '', deliveryDays: '', minOrder: '' })
    setShowForm(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const deleteRate = (id) => {
    setRates(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Shipping Rates</h1>
          <p className="text-sm text-gray-500 mt-1">Manage shipping methods and costs</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
          <FiPlus className="w-4 h-4" /> Add Shipping
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">New Shipping Method</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name</label>
              <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Standard Shipping" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Amount ($)</label>
              <input type="number" step="0.01" min="0" value={form.amount} onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))} placeholder="0.00" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Delivery (days)</label>
              <input value={form.deliveryDays} onChange={e => setForm(prev => ({ ...prev, deliveryDays: e.target.value }))} placeholder="3-5" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Min Order ($)</label>
              <input type="number" step="0.01" min="0" value={form.minOrder} onChange={e => setForm(prev => ({ ...prev, minOrder: e.target.value }))} placeholder="0 for all" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addRate} className="px-5 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">Add</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Cancel</button>
          </div>
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 mb-4">
          <FiCheck className="w-4 h-4" /> Shipping rate saved!
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {rates.length === 0 ? (
          <div className="p-10 text-center">
            <FiTruck className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No shipping rates yet.</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Shipping" to create one.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {rates.map(r => (
              <div key={r.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF4F8B]/10 to-purple-500/10 rounded-xl flex items-center justify-center">
                  <FiTruck className="w-5 h-5 text-[#FF4F8B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.deliveryDays} days{r.minOrder > 0 ? ` · Min: $${r.minOrder.toFixed(2)}` : ''}</p>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">${r.amount.toFixed(2)}</span>
                <button onClick={() => deleteRate(r.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        )}
        {rates.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500">
            <span>{rates.length} methods</span>
          </div>
        )}
      </div>
    </div>
  )
}
