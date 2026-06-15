import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { AdminTable, AdminModal, ConfirmDialog } from '../../components/admin/Shared'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'

export default function AdminOffers() {
  const { offers, setOffers, addItem, updateItem, deleteItem } = useAdmin()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ title: '', code: '', discount: '', type: 'percentage', validUntil: '', minPurchase: '', description: '' })

  const filtered = offers.filter(o =>
    o.title?.toLowerCase().includes(search.toLowerCase()) ||
    o.code?.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', code: '', discount: '', type: 'percentage', validUntil: '', minPurchase: '', description: '' })
    setModalOpen(true)
  }

  const openEdit = (o) => {
    setEditing(o)
    setForm({ title: o.title, code: o.code, discount: String(o.discount), type: o.type || 'percentage', validUntil: o.validUntil || '', minPurchase: o.minPurchase ? String(o.minPurchase) : '', description: o.description || '' })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const data = { ...form, discount: Number(form.discount), minPurchase: form.minPurchase ? Number(form.minPurchase) : undefined }
    if (editing) {
      updateItem('offers', setOffers, editing.id, data)
    } else {
      addItem('offers', setOffers, data)
    }
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Offers & Coupons ({offers.length})</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
          <FiPlus className="w-4 h-4" /> Add Offer
        </button>
      </div>
      <AdminTable
        columns={[
          { key: 'title', label: 'Offer' },
          { key: 'code', label: 'Code', render: o => <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg font-semibold">{o.code}</span> },
          { key: 'discount', label: 'Discount', render: o => <span className="font-semibold">{o.type === 'percentage' ? `${o.discount}%` : `$${o.discount} off`}</span> },
          { key: 'validUntil', label: 'Valid Until' },
        ]}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        renderActions={o => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openEdit(o)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"><FiEdit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => setConfirmDelete(o)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button>
          </div>
        )}
      />
      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Offer' : 'Add Offer'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Coupon Code</label>
              <input value={form.code} onChange={e => setForm({...form, code: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Discount Value</label>
              <input type="number" min="0" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Valid Until</label>
              <input type="date" value={form.validUntil} onChange={e => setForm({...form, validUntil: e.target.value})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#FF4F8B] rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">{editing ? 'Update' : 'Create'} Offer</button>
          </div>
        </form>
      </AdminModal>
      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => deleteItem('offers', setOffers, confirmDelete.id)} />
    </div>
  )
}
