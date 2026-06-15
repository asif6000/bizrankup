import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { AdminTable, AdminModal, ConfirmDialog } from '../../components/admin/Shared'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'

export default function AdminBundles() {
  const { bundles, setBundles, products, addItem, updateItem, deleteItem } = useAdmin()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ name: '', desc: '', discount: '', badge: '', badgeColor: 'bg-rose-500', accent: '#FF4F8B', productIds: [] })

  const filtered = bundles.filter(b =>
    b.name?.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', desc: '', discount: '20', badge: '', badgeColor: 'bg-rose-500', accent: '#FF4F8B', productIds: [] })
    setModalOpen(true)
  }

  const openEdit = (b) => {
    setEditing(b)
    setForm({ name: b.name, desc: b.desc, discount: String(b.discount), badge: b.badge, badgeColor: b.badgeColor, accent: b.accent, productIds: b.productIds || [] })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const data = {
      name: form.name,
      desc: form.desc,
      discount: Number(form.discount),
      badge: form.badge,
      badgeColor: form.badgeColor,
      accent: form.accent,
      productIds: form.productIds,
      gradient: 'from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800',
      decor: 'from-gray-200/50 to-gray-200/50',
    }
    if (editing) {
      updateItem('bundles', setBundles, editing.id, data)
    } else {
      addItem('bundles', setBundles, data)
    }
    setModalOpen(false)
  }

  const toggleProductId = (id) => {
    setForm(prev => ({
      ...prev,
      productIds: prev.productIds.includes(id) ? prev.productIds.filter(p => p !== id) : [...prev.productIds, id],
    }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Bundle Deals ({bundles.length})</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
          <FiPlus className="w-4 h-4" /> Add Bundle
        </button>
      </div>
      <AdminTable
        columns={[
          { key: 'name', label: 'Bundle Name' },
          { key: 'desc', label: 'Description', render: b => <span className="text-gray-500 line-clamp-1 max-w-xs">{b.desc}</span> },
          { key: 'discount', label: 'Discount', render: b => <span className="font-semibold text-emerald-500">{b.discount}% OFF</span> },
          { key: 'badge', label: 'Badge', render: b => <span className="px-2 py-0.5 rounded text-xs font-semibold text-white" style={{backgroundColor: b.badgeColor === 'bg-rose-500' ? '#F43F5E' : b.badgeColor === 'bg-amber-500' ? '#F59E0B' : '#10B981'}}>{b.badge}</span> },
          { key: 'products', label: 'Products', render: b => <span>{b.productIds?.length || 0} items</span> },
        ]}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search bundles..."
        renderActions={b => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openEdit(b)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"><FiEdit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => setConfirmDelete(b)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button>
          </div>
        )}
      />
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Bundle' : 'Add Bundle'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Bundle Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Discount (%)</label>
              <input type="number" min="0" max="100" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
            <textarea value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} rows={2} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Badge Text</label>
              <input value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Badge Color</label>
              <select value={form.badgeColor} onChange={e => setForm({...form, badgeColor: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors">
                <option value="bg-rose-500">Rose</option>
                <option value="bg-amber-500">Amber</option>
                <option value="bg-emerald-500">Emerald</option>
                <option value="bg-blue-500">Blue</option>
                <option value="bg-purple-500">Purple</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Products in Bundle</label>
            <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2 space-y-1">
              {products.slice(0, 20).map(p => (
                <label key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-sm">
                  <input type="checkbox" checked={form.productIds.includes(p.id)} onChange={() => toggleProductId(p.id)} className="rounded text-[#FF4F8B] focus:ring-[#FF4F8B]" />
                  {p.name}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#FF4F8B] rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">{editing ? 'Update' : 'Create'} Bundle</button>
          </div>
        </form>
      </AdminModal>
      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => deleteItem('bundles', setBundles, confirmDelete.id)} />
    </div>
  )
}
