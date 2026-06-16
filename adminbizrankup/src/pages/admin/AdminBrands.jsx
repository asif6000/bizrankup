import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { AdminTable, AdminModal, ConfirmDialog } from '../../components/admin/Shared'
import ImageUpload from '../../components/admin/ImageUpload'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'

export default function AdminBrands() {
  const { brands, setBrands, addItem, updateItem, deleteItem } = useAdmin()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ name: '', logo: '' })

  const filtered = brands.filter(b => b.name?.toLowerCase().includes(search.toLowerCase()))

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', logo: '' })
    setModalOpen(true)
  }

  const openEdit = (b) => {
    setEditing(b)
    setForm({ name: b.name, logo: b.logo || '' })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const data = { ...form }
    if (editing) {
      updateItem('brands', setBrands, editing.id, data)
    } else {
      addItem('brands', setBrands, data)
    }
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Brands ({brands.length})</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
          <FiPlus className="w-4 h-4" /> Add Brand
        </button>
      </div>
      <AdminTable
        columns={[
          { key: 'name', label: 'Brand', render: b => (
            <div className="flex items-center gap-3">
              {b.logo ? <img src={b.logo} alt={b.name} className="w-10 h-10 rounded-lg object-contain bg-gray-50 p-1 dark:bg-gray-800" /> : <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-xs">N/A</div>}
              <p className="font-medium text-gray-900 dark:text-white">{b.name}</p>
            </div>
          )},
        ]}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        renderActions={b => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openEdit(b)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"><FiEdit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => setConfirmDelete(b)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button>
          </div>
        )}
      />
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Brand' : 'Add Brand'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Brand Name</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <ImageUpload label="Logo" value={form.logo} onChange={url => setForm({...form, logo: url})} />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#FF4F8B] rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">{editing ? 'Update' : 'Create'} Brand</button>
          </div>
        </form>
      </AdminModal>
      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => deleteItem('brands', setBrands, confirmDelete.id)} />
    </div>
  )
}
