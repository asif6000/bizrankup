import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiDollarSign, FiFilter } from 'react-icons/fi'

const STORAGE_KEY = 'shajgoj_admin_expenses'

const categories = [
  'Marketing', 'Shipping', 'Supplies', 'Utilities', 'Salary',
  'Maintenance', 'Software', 'Office', 'Travel', 'Other',
]

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}

export default function AdminExpenses() {
  const [expenses, setExpenses] = useState(load)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('')
  const [form, setForm] = useState({ category: 'Other', amount: '', description: '', date: new Date().toISOString().split('T')[0] })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  }, [expenses])

  const addExpense = () => {
    if (!form.amount || !form.description) return
    setExpenses(prev => [{ id: Date.now(), ...form, amount: parseFloat(form.amount) }, ...prev])
    setForm({ category: 'Other', amount: '', description: '', date: new Date().toISOString().split('T')[0] })
    setShowForm(false)
  }

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  const filtered = filter ? expenses.filter(e => e.category === filter) : expenses
  const total = filtered.reduce((s, e) => s + e.amount, 0)
  const grandTotal = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage business expenses</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
          <FiPlus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 uppercase font-semibold">Total Expenses</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${grandTotal.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 uppercase font-semibold">This Month</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${expenses.filter(e => e.date?.startsWith(new Date().toISOString().slice(0, 7))).reduce((s, e) => s + e.amount, 0).toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 uppercase font-semibold">Entries</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{expenses.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 uppercase font-semibold">Avg/Entry</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${expenses.length ? (grandTotal / expenses.length).toFixed(2) : '0.00'}</p>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">New Expense</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Amount ($)</label>
              <input type="number" step="0.01" value={form.amount} onChange={e => setForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))} placeholder="0.00" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
              <input type="text" value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="What is this for?" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addExpense} className="px-5 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">Add</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Cancel</button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        <FiFilter className="w-4 h-4 text-gray-400 shrink-0" />
        <button onClick={() => setFilter('')} className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all ${!filter ? 'bg-[#FF4F8B] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700'}`}>All</button>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all ${filter === c ? 'bg-[#FF4F8B] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700'}`}>{c}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <FiDollarSign className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No expenses found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map(e => (
              <div key={e.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <span className="shrink-0 text-[10px] font-semibold px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{e.category}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{e.description}</p>
                  <p className="text-xs text-gray-400">{e.date}</p>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">${e.amount.toFixed(2)}</span>
                <button onClick={() => deleteExpense(e.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        )}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-500">{filtered.length} entries</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">Total: ${total.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
