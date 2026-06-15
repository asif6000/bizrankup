import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { AdminTable, AdminModal, ConfirmDialog } from '../../components/admin/Shared'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'

const typeColors = {
  info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
  success: 'bg-green-50 dark:bg-green-900/20 text-green-600',
  warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
  error: 'bg-red-50 dark:bg-red-900/20 text-red-600',
}

export default function AdminNotifications() {
  const { notifications, setNotifications, addItem, updateItem, deleteItem } = useAdmin()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ title: '', message: '', type: 'info', read: false })

  const filtered = notifications.filter(n =>
    n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.message?.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => { setEditing(null); setForm({ title: '', message: '', type: 'info', read: false }); setModalOpen(true) }
  const openEdit = (n) => { setEditing(n); setForm({ title: n.title, message: n.message, type: n.type || 'info', read: n.read || false }); setModalOpen(true) }

  const handleSave = (e) => {
    e.preventDefault()
    const data = { ...form, date: editing?.date || new Date().toISOString().split('T')[0] }
    if (editing) { updateItem('notifications', setNotifications, editing.id, data) } else { addItem('notifications', setNotifications, data) }
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Notifications ({notifications.length})</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all"><FiPlus className="w-4 h-4" /> Add Notification</button>
      </div>
      <AdminTable
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'type', label: 'Type', render: n => <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg uppercase ${typeColors[n.type] || typeColors.info}`}>{n.type}</span> },
          { key: 'read', label: 'Read', render: n => <span className="text-xs">{n.read ? 'Read' : 'Unread'}</span> },
          { key: 'date', label: 'Date' },
        ]}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        renderActions={n => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openEdit(n)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"><FiEdit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => setConfirmDelete(n)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button>
          </div>
        )}
      />
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Notification' : 'Add Notification'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Message</label>
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={3} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors">
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Read</label>
              <select value={form.read ? 'yes' : 'no'} onChange={e => setForm({...form, read: e.target.value === 'yes'})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors">
                <option value="no">Unread</option>
                <option value="yes">Read</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#FF4F8B] rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </AdminModal>
      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => deleteItem('notifications', setNotifications, confirmDelete.id)} />
    </div>
  )
}
