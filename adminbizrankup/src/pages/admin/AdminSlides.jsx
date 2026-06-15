import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { AdminTable, AdminModal, ConfirmDialog } from '../../components/admin/Shared'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'

export default function AdminSlides() {
  const { heroSlides, setHeroSlides, addItem, updateItem, deleteItem, promoBanners, setPromoBanners } = useAdmin()
  const [tab, setTab] = useState('hero')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ image: '', title: '', subtitle: '', link: '', active: true })

  const items = tab === 'hero' ? heroSlides : promoBanners
  const setItems = tab === 'hero' ? setHeroSlides : setPromoBanners

  const filtered = items.filter(item => item.title?.toLowerCase().includes(search.toLowerCase()))

  const openCreate = () => {
    setEditing(null)
    setForm({ image: '', title: '', subtitle: '', link: '', active: true })
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({ image: item.image || '', title: item.title || '', subtitle: item.subtitle || '', link: item.link || '', active: item.active !== false })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const data = { ...form }
    if (editing) {
      updateItem(tab === 'hero' ? 'heroSlides' : 'promoBanners', setItems, editing.id, data)
    } else {
      addItem(tab === 'hero' ? 'heroSlides' : 'promoBanners', setItems, data)
    }
    setModalOpen(false)
  }

  const handleDelete = (item) => {
    deleteItem(tab === 'hero' ? 'heroSlides' : 'promoBanners', setItems, item.id)
  }

  const toggleActive = (item) => {
    updateItem(tab === 'hero' ? 'heroSlides' : 'promoBanners', setItems, item.id, { active: !item.active })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{tab === 'hero' ? 'Hero Slides' : 'Promo Banners'}</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
          <FiPlus className="w-4 h-4" /> Add {tab === 'hero' ? 'Slide' : 'Banner'}
        </button>
      </div>
      <div className="flex items-center gap-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        <button onClick={() => setTab('hero')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'hero' ? 'bg-white dark:bg-gray-700 text-[#FF4F8B] shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Hero Slides ({heroSlides.length})</button>
        <button onClick={() => setTab('promo')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'promo' ? 'bg-white dark:bg-gray-700 text-[#FF4F8B] shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Promo Banners ({promoBanners.length})</button>
      </div>
      <AdminTable
        columns={[
          { key: 'preview', label: 'Preview', render: item => (
            <div className="flex items-center gap-3">
              {item.image ? <img src={item.image} alt={item.title} className="w-16 h-10 rounded-lg object-cover bg-gray-100" /> : <div className="w-16 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-xs">No img</div>}
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{item.title || 'Untitled'}</p>
                {item.subtitle && <p className="text-xs text-gray-400 truncate max-w-[200px]">{item.subtitle}</p>}
              </div>
            </div>
          )},
          { key: 'active', label: 'Active', render: item => (
            <button onClick={() => toggleActive(item)} className={`w-10 h-5 rounded-full transition-all relative ${item.active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${item.active ? 'left-5' : 'left-0.5'}`} />
            </button>
          )},
        ]}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        renderActions={item => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"><FiEdit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => setConfirmDelete(item)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button>
          </div>
        )}
      />
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit' : 'Add'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Image URL</label>
            <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Subtitle</label>
            <input value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Link URL</label>
            <input value={form.link} onChange={e => setForm({...form, link: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#FF4F8B] rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </AdminModal>
      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { handleDelete(confirmDelete); setConfirmDelete(null) }} />
    </div>
  )
}
