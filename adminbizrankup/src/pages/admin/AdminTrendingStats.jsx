import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { AdminTable, AdminModal, ConfirmDialog } from '../../components/admin/Shared'
import { FiEdit2, FiTrash2, FiPlus, FiHeart, FiPackage, FiAward, FiStar } from 'react-icons/fi'

const iconMap = { FiHeart, FiPackage, FiAward, FiStar }

export default function AdminTrendingStats() {
  const { trendingStats, setTrendingStats, addItem, updateItem, deleteItem } = useAdmin()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ label: '', value: '', suffix: '+', icon: 'FiHeart', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' })

  const filtered = trendingStats.filter(s =>
    s.label?.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm({ label: '', value: '100', suffix: '+', icon: 'FiHeart', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' })
    setModalOpen(true)
  }

  const openEdit = (s) => {
    setEditing(s)
    setForm({ label: s.label, value: String(s.value), suffix: s.suffix || '+', icon: s.icon || 'FiHeart', color: s.color || 'text-rose-500', bg: s.bg || 'bg-rose-50 dark:bg-rose-900/20' })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const data = { label: form.label, value: Number(form.value), suffix: form.suffix, icon: form.icon, color: form.color, bg: form.bg }
    if (editing) {
      updateItem('trendingStats', setTrendingStats, editing.id, data)
    } else {
      addItem('trendingStats', setTrendingStats, data)
    }
    setModalOpen(false)
  }

  const iconOptions = [
    { value: 'FiHeart', label: 'Heart', color: 'text-rose-500' },
    { value: 'FiPackage', label: 'Package', color: 'text-purple-500' },
    { value: 'FiAward', label: 'Award', color: 'text-emerald-500' },
    { value: 'FiStar', label: 'Star', color: 'text-amber-500' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Trending Stats ({trendingStats.length})</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
          <FiPlus className="w-4 h-4" /> Add Stat
        </button>
      </div>
      <AdminTable
        columns={[
          { key: 'icon', label: 'Icon', render: s => {
            const Icon = iconMap[s.icon] || FiHeart
            return <Icon className={`w-5 h-5 ${s.color}`} />
          }},
          { key: 'label', label: 'Label' },
          { key: 'value', label: 'Value', render: s => <span className="font-bold text-lg">{s.value}{s.suffix}</span> },
          { key: 'color', label: 'Style', render: s => (
            <div className="flex items-center gap-1.5">
              <div className={`w-4 h-4 rounded ${s.color?.replace('text-', 'bg-')} opacity-30`} />
              <span className="text-xs text-gray-400">{s.color}</span>
            </div>
          )},
        ]}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search stats..."
        renderActions={s => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openEdit(s)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"><FiEdit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => setConfirmDelete(s)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button>
          </div>
        )}
      />
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Stat' : 'Add Stat'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Label</label>
              <input value={form.label} onChange={e => setForm({...form, label: e.target.value})} required placeholder="e.g. Happy Customers" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Value</label>
              <input type="number" min="0" value={form.value} onChange={e => setForm({...form, value: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Suffix</label>
              <input value={form.suffix} onChange={e => setForm({...form, suffix: e.target.value})} placeholder="+, K+, %" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Icon</label>
              <select value={form.icon} onChange={e => {
                const opt = iconOptions.find(o => o.value === e.target.value)
                setForm({...form, icon: e.target.value, color: opt?.color || 'text-rose-500'})
              }} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors">
                {iconOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#FF4F8B] rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">{editing ? 'Update' : 'Create'} Stat</button>
          </div>
        </form>
      </AdminModal>
      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => deleteItem('trendingStats', setTrendingStats, confirmDelete.id)} />
    </div>
  )
}
