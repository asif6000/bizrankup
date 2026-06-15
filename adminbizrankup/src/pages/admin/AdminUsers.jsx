import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { AdminTable, AdminModal, ConfirmDialog } from '../../components/admin/Shared'
import { FiEdit2, FiTrash2, FiMail, FiPhone, FiAward } from 'react-icons/fi'

export default function AdminUsers() {
  const { users, setUsers, updateItem, deleteItem } = useAdmin()
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', tier: 'Silver' })

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const openEdit = (u) => {
    setEditing(u)
    setForm({ name: u.name, email: u.email, phone: u.phone || '', tier: u.tier || 'Silver' })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    updateItem('users', setUsers, editing.id, form)
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">User Management ({users.length})</h1>
      </div>
      <AdminTable
        columns={[
          { key: 'name', label: 'User', render: u => (
            <div className="flex items-center gap-3">
              <img src={u.avatar || 'https://i.pravatar.cc/80?u=' + u.id} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                <p className="text-xs text-gray-400">Joined {u.joinDate}</p>
              </div>
            </div>
          )},
          { key: 'email', label: 'Contact', render: u => (
            <div className="space-y-0.5">
              <p className="flex items-center gap-1.5 text-xs"><FiMail className="w-3 h-3 text-gray-400" /> {u.email}</p>
              <p className="flex items-center gap-1.5 text-xs"><FiPhone className="w-3 h-3 text-gray-400" /> {u.phone || 'N/A'}</p>
            </div>
          )},
          { key: 'tier', label: 'Tier', render: u => (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.tier === 'Gold' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
              <FiAward className="w-3 h-3 inline mr-0.5" /> {u.tier}
            </span>
          )},
          { key: 'orders', label: 'Orders', render: u => <span>{u.orders || 0}</span> },
        ]}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users..."
        renderActions={u => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openEdit(u)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"><FiEdit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => setConfirmDelete(u)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button>
          </div>
        )}
      />
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Edit User">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Tier</label>
              <select value={form.tier} onChange={e => setForm({...form, tier: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors">
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#FF4F8B] rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">Update User</button>
          </div>
        </form>
      </AdminModal>
      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => deleteItem('users', setUsers, confirmDelete.id)} />
    </div>
  )
}
