import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { AdminTable, AdminModal, ConfirmDialog } from '../../components/admin/Shared'
import { FiEdit2, FiTrash2, FiPlus, FiClock } from 'react-icons/fi'

export default function AdminFlashSales() {
  const { flashSales, setFlashSales, products, addItem, updateItem, deleteItem } = useAdmin()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ name: '', discount: '', endsAt: '', active: true })

  const filtered = flashSales.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', discount: '20', endsAt: '', active: true })
    setModalOpen(true)
  }

  const openEdit = (f) => {
    setEditing(f)
    setForm({ name: f.name, discount: String(f.discount || 0), endsAt: f.endsAt ? f.endsAt.slice(0, 16) : '', active: f.active !== false })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const data = {
      name: form.name,
      discount: Number(form.discount),
      originalPrice: 0,
      price: 0,
      endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : '',
      active: form.active,
      image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600',
    }
    if (editing) {
      updateItem('flashSales', setFlashSales, editing.id, data)
    } else {
      addItem('flashSales', setFlashSales, data)
    }
    setModalOpen(false)
  }

  const getTimeLeft = (endsAt) => {
    if (!endsAt) return 'N/A'
    const diff = new Date(endsAt) - Date.now()
    if (diff <= 0) return 'Expired'
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    return `${h}h ${m}m`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Flash Sales ({flashSales.length})</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
          <FiPlus className="w-4 h-4" /> Add Flash Sale
        </button>
      </div>
      <AdminTable
        columns={[
          { key: 'name', label: 'Product' },
          { key: 'discount', label: 'Discount', render: f => <span className="font-semibold text-red-500">{f.discount}% OFF</span> },
          { key: 'endsAt', label: 'Time Left', render: f => (
            <span className={`flex items-center gap-1 ${getTimeLeft(f.endsAt) === 'Expired' ? 'text-red-500' : 'text-gray-600'}`}>
              <FiClock className="w-3.5 h-3.5" /> {getTimeLeft(f.endsAt)}
            </span>
          )},
          { key: 'active', label: 'Status', render: f => (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${f.active !== false ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
              {f.active !== false ? 'Active' : 'Inactive'}
            </span>
          )},
        ]}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search flash sales..."
        renderActions={f => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openEdit(f)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"><FiEdit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => setConfirmDelete(f)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button>
          </div>
        )}
      />
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Flash Sale' : 'Add Flash Sale'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Product Name</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Discount (%)</label>
              <input type="number" min="1" max="99" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Active</label>
              <select value={form.active} onChange={e => setForm({...form, active: e.target.value === 'true'})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Ends At</label>
            <input type="datetime-local" value={form.endsAt} onChange={e => setForm({...form, endsAt: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#FF4F8B] rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">{editing ? 'Update' : 'Create'} Flash Sale</button>
          </div>
        </form>
      </AdminModal>
      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => deleteItem('flashSales', setFlashSales, confirmDelete.id)} />
    </div>
  )
}
