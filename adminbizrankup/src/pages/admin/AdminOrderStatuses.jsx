import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { AdminTable, AdminModal, ConfirmDialog } from '../../components/admin/Shared'
import { FiEdit2, FiTrash2, FiPlus, FiCheck, FiClock } from 'react-icons/fi'

export default function AdminOrderStatuses() {
  const { orderStatuses, setOrderStatuses, addItem, updateItem, deleteItem } = useAdmin()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ label: '', order: '' })

  const sorted = [...orderStatuses].sort((a, b) => (a.order || a.id) - (b.order || b.id))

  const filtered = sorted.filter(s =>
    s.label?.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm({ label: '', order: String(sorted.length + 1) })
    setModalOpen(true)
  }

  const openEdit = (s) => {
    setEditing(s)
    setForm({ label: s.label, order: String(s.order || s.id || '') })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const data = { label: form.label, order: Number(form.order), date: null, completed: false }
    if (editing) {
      updateItem('orderStatuses', setOrderStatuses, editing.id, data)
    } else {
      addItem('orderStatuses', setOrderStatuses, data)
    }
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Order Statuses ({orderStatuses.length})</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
          <FiPlus className="w-4 h-4" /> Add Status
        </button>
      </div>
      <AdminTable
        columns={[
          { key: 'order', label: 'Order', render: s => <span className="text-gray-400">#{s.order || s.id}</span> },
          { key: 'label', label: 'Status Label' },
          { key: 'completed', label: 'Status', render: s => (
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.completed ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
              {s.completed ? <FiCheck className="w-3 h-3" /> : <FiClock className="w-3 h-3" />}
              {s.completed ? 'Completed' : 'Pending'}
            </span>
          )},
          { key: 'date', label: 'Date', render: s => <span className="text-gray-500">{s.date || '—'}</span> },
        ]}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search statuses..."
        renderActions={s => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openEdit(s)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"><FiEdit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => setConfirmDelete(s)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button>
          </div>
        )}
      />
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Status' : 'Add Status'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status Label</label>
            <input value={form.label} onChange={e => setForm({...form, label: e.target.value})} required placeholder="e.g. Out for Delivery" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Order (position)</label>
            <input type="number" min="1" value={form.order} onChange={e => setForm({...form, order: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#FF4F8B] rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">{editing ? 'Update' : 'Create'} Status</button>
          </div>
        </form>
      </AdminModal>
      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => deleteItem('orderStatuses', setOrderStatuses, confirmDelete.id)} />
    </div>
  )
}
