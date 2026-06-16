import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { AdminTable, AdminModal, ConfirmDialog } from '../../components/admin/Shared'
import ImageUpload from '../../components/admin/ImageUpload'
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi'

export default function AdminCategories() {
  const { categories, setCategories, addItem, updateItem, deleteItem } = useAdmin()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ name: '', image: '', slug: '', subcategories: [] })
  const [subForm, setSubForm] = useState({ name: '', slug: '' })
  const [subModal, setSubModal] = useState(false)
  const [editingSub, setEditingSub] = useState(null)

  const filtered = categories.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()))

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', image: '', slug: '', subcategories: [] })
    setModalOpen(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    setForm({ name: c.name, image: c.image || '', slug: c.slug || '', subcategories: c.subcategories || [] })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const data = { ...form, subcategories: form.subcategories || [] }
    if (editing) {
      updateItem('categories', setCategories, editing.id, data)
    } else {
      addItem('categories', setCategories, data)
    }
    setModalOpen(false)
  }

  const openSubCreate = () => {
    setEditingSub(null)
    setSubForm({ name: '', slug: '' })
    setSubModal(true)
  }

  const openSubEdit = (sub) => {
    setEditingSub(sub)
    setSubForm({ name: sub.name, slug: sub.slug })
    setSubModal(true)
  }

  const handleSubSave = (e) => {
    e.preventDefault()
    let updated
    if (editingSub) {
      updated = form.subcategories.map(s => s.id === editingSub.id ? { ...s, name: subForm.name, slug: subForm.slug } : s)
    } else {
      updated = [...form.subcategories, { id: Date.now(), name: subForm.name, slug: subForm.slug, productCount: 0 }]
    }
    setForm({ ...form, subcategories: updated })
    setSubModal(false)
  }

  const deleteSub = (subId) => {
    setForm({ ...form, subcategories: form.subcategories.filter(s => s.id !== subId) })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Categories ({categories.length})</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
          <FiPlus className="w-4 h-4" /> Add Category
        </button>
      </div>
      <AdminTable
        columns={[
          { key: 'image', label: 'Category', render: c => (
            <div className="flex items-center gap-3">
              {c.image ? <img src={c.image} alt={c.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" /> : <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-xs">N/A</div>}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{c.name}</p>
                <p className="text-xs text-gray-400">/{c.slug}</p>
              </div>
            </div>
          )},
          { key: 'subs', label: 'Subcategories', render: c => (
            <div className="flex flex-wrap gap-1 max-w-[300px]">
              {(c.subcategories || []).length > 0
                ? c.subcategories.map(sub => (
                    <span key={sub.id} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-lg whitespace-nowrap">{sub.name}</span>
                  ))
                : <span className="text-xs text-gray-400">—</span>
              }
            </div>
          )},
        ]}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        renderActions={c => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openEdit(c)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"><FiEdit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => setConfirmDelete(c)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button>
          </div>
        )}
      />
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'Add Category'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Slug</label>
            <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <ImageUpload label="Image" value={form.image} onChange={url => setForm({...form, image: url})} />

          {/* Subcategories */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase">Subcategories</p>
              <button type="button" onClick={openSubCreate} className="flex items-center gap-1 text-xs font-semibold text-[#FF4F8B] hover:text-[#e64579] transition-colors">
                <FiPlus className="w-3 h-3" /> Add Subcategory
              </button>
            </div>
            {form.subcategories.length === 0 ? (
              <p className="text-sm text-gray-400">No subcategories yet</p>
            ) : (
              <div className="space-y-1.5">
                {form.subcategories.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{sub.name}</p>
                      <p className="text-xs text-gray-400">/{sub.slug}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => openSubEdit(sub)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"><FiEdit2 className="w-3 h-3" /></button>
                      <button type="button" onClick={() => deleteSub(sub.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"><FiTrash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#FF4F8B] rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">{editing ? 'Update' : 'Create'} Category</button>
          </div>
        </form>
      </AdminModal>

      {/* Subcategory modal */}
      <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 ${subModal ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/40" onClick={() => setSubModal(false)} />
        <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">{editingSub ? 'Edit Subcategory' : 'Add Subcategory'}</h3>
            <button onClick={() => setSubModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><FiX className="w-4 h-4 text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubSave} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name</label>
              <input value={subForm.name} onChange={e => setSubForm({...subForm, name: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Slug</label>
              <input value={subForm.slug} onChange={e => setSubForm({...subForm, slug: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setSubModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-[#FF4F8B] rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">{editingSub ? 'Update' : 'Add'}</button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => deleteItem('categories', setCategories, confirmDelete.id)} />
    </div>
  )
}
