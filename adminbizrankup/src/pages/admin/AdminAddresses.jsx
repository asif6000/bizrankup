import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { AdminTable, AdminModal, ConfirmDialog } from '../../components/admin/Shared'
import { FiEdit2, FiTrash2, FiPlus, FiHome, FiBriefcase } from 'react-icons/fi'

export default function AdminAddresses() {
  const { addresses, setAddresses, addItem, updateItem, deleteItem } = useAdmin()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ label: 'Home', street: '', city: '', state: '', zip: '', default: false })

  const filtered = addresses.filter(a =>
    a.street?.toLowerCase().includes(search.toLowerCase()) ||
    a.city?.toLowerCase().includes(search.toLowerCase()) ||
    a.label?.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm({ label: 'Home', street: '', city: '', state: '', zip: '', default: false })
    setModalOpen(true)
  }

  const openEdit = (a) => {
    setEditing(a)
    setForm({ label: a.label, street: a.street, city: a.city, state: a.state, zip: a.zip, default: a.default || false })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const data = { label: form.label, street: form.street, city: form.city, state: form.state, zip: form.zip, default: form.default }
    if (editing) {
      updateItem('addresses', setAddresses, editing.id, data)
    } else {
      addItem('addresses', setAddresses, data)
    }
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Address Management ({addresses.length})</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
          <FiPlus className="w-4 h-4" /> Add Address
        </button>
      </div>
      <AdminTable
        columns={[
          { key: 'label', label: 'Label', render: a => (
            <span className="flex items-center gap-1.5 font-medium">{a.label === 'Home' ? <FiHome className="w-3.5 h-3.5 text-gray-400" /> : <FiBriefcase className="w-3.5 h-3.5 text-gray-400" />} {a.label}</span>
          )},
          { key: 'street', label: 'Address', render: a => <span className="text-gray-600">{a.street}, {a.city}, {a.state} {a.zip}</span> },
          { key: 'default', label: 'Default', render: a => a.default ? <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">Default</span> : <span className="text-gray-400">—</span> },
        ]}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search addresses..."
        renderActions={a => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openEdit(a)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"><FiEdit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => setConfirmDelete(a)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button>
          </div>
        )}
      />
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Address' : 'Add Address'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Label</label>
              <select value={form.label} onChange={e => setForm({...form, label: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors">
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Default</label>
              <select value={form.default} onChange={e => setForm({...form, default: e.target.value === 'true'})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Street Address</label>
            <input value={form.street} onChange={e => setForm({...form, street: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">City</label>
              <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">State</label>
              <input value={form.state} onChange={e => setForm({...form, state: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">ZIP</label>
              <input value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#FF4F8B] rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">{editing ? 'Update' : 'Create'} Address</button>
          </div>
        </form>
      </AdminModal>
      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => deleteItem('addresses', setAddresses, confirmDelete.id)} />
    </div>
  )
}
