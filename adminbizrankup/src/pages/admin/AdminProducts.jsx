import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { AdminTable, AdminModal, ConfirmDialog } from '../../components/admin/Shared'
import { FiEdit2, FiTrash2, FiPlus, FiCheck, FiX } from 'react-icons/fi'

export default function AdminProducts() {
  const { products, categories, brands, addItem, updateItem, deleteItem, setProducts } = useAdmin()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({
    name: '', slug: '', category: '', brand: '', price: '', originalPrice: '',
    image: '', images: '', rating: 4.5, reviewCount: 0, inStock: true, badge: '',
    description: '',
  })

  const catName = (c) => typeof c === 'object' ? c?.name || '' : (c || '')
  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    catName(p.category).toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', slug: '', category: '', brand: '', price: '', originalPrice: '', image: '', images: '', rating: 4.5, reviewCount: 0, inStock: true, badge: '', description: '' })
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    const catName = typeof p.category === 'object' ? p.category?.name || '' : (p.category || '')
    const brandName = typeof p.brand === 'object' ? p.brand?.name || '' : (p.brand || '')
    setForm({
      name: p.name, slug: p.slug, category: catName, brand: brandName,
      price: String(p.price), originalPrice: p.originalPrice ? String(p.originalPrice) : '',
      image: p.image, images: Array.isArray(p.images) ? p.images.join(', ') : (p.images || ''),
      rating: p.rating, reviewCount: p.reviewCount, inStock: p.inStock, badge: p.badge || '',
      description: p.description || '',
    })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const data = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [],
    }
    if (editing) {
      updateItem('products', setProducts, editing.id, data)
    } else {
      addItem('products', setProducts, data)
    }
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Products ({products.length})</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
          <FiPlus className="w-4 h-4" /> Add Product
        </button>
      </div>
      <AdminTable
        columns={[
          { key: 'name', label: 'Product', render: p => (
            <div className="flex items-center gap-3">
              <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{p.name}</p>
              </div>
            </div>
          )},
          { key: 'price', label: 'Price', render: p => <span className="font-semibold">${p.price.toFixed(2)}</span> },
          { key: 'inStock', label: 'Stock', render: p => (
            p.inStock
              ? <span className="flex items-center gap-1 text-xs text-emerald-600"><FiCheck className="w-3 h-3" /> In Stock</span>
              : <span className="flex items-center gap-1 text-xs text-red-500"><FiX className="w-3 h-3" /> Out</span>
          )},
          { key: 'rating', label: 'Rating', render: p => <span className="text-sm">{'⭐'.repeat(Math.round(p.rating))} {p.rating}</span> },
        ]}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        renderActions={p => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openEdit(p)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"><FiEdit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => setConfirmDelete(p)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button>
          </div>
        )}
      />
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'} size="xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Slug</label>
              <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors">
                <option value="">Select</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Brand</label>
              <input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Price ($)</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Original Price ($)</label>
              <input type="number" step="0.01" min="0" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Badge</label>
              <input value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} placeholder="e.g. Sale, New" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Image URL</label>
            <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="inStock" checked={form.inStock} onChange={e => setForm({...form, inStock: e.target.checked})} className="rounded border-gray-300" />
            <label htmlFor="inStock" className="text-sm text-gray-700 dark:text-gray-300">In Stock</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#FF4F8B] rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">{editing ? 'Update' : 'Create'} Product</button>
          </div>
        </form>
      </AdminModal>
      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => deleteItem('products', setProducts, confirmDelete.id)} />
    </div>
  )
}
