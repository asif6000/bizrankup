import { useState, useEffect } from 'react'
import { AdminTable, ConfirmDialog } from '../../components/admin/Shared'
import { FiTrash2, FiStar } from 'react-icons/fi'
import { reviews as reviewsApi } from '../../api/client'

function mapReview(r) {
  return {
    id: r.id,
    productId: r.product_id,
    userName: r.user_name || 'Customer',
    rating: Number(r.rating),
    title: '',
    text: r.comment || '',
    date: r.created_at ? r.created_at.split('T')[0] : '',
  }
}

export default function AdminReviews() {
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    reviewsApi.list()
      .then(data => setReviews((Array.isArray(data) ? data : []).map(mapReview)))
      .catch(() => setReviews([]))
  }, [])

  const filtered = reviews.filter(r =>
    r.userName?.toLowerCase().includes(search.toLowerCase()) ||
    r.text?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (review) => {
    try { await reviewsApi.delete(review.id) } catch { /* ignore */ }
    setReviews(prev => prev.filter(r => r.id !== review.id))
    setConfirmDelete(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Reviews ({reviews.length})</h1>
      </div>
      <AdminTable
        columns={[
          { key: 'review', label: 'Review', render: r => (
            <div className="max-w-md">
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <FiStar key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
                ))}
                <span className="text-xs text-gray-400 ml-1">{r.rating}/5</span>
              </div>
              {r.title && <p className="text-sm font-medium text-gray-900 dark:text-white">{r.title}</p>}
              <p className="text-sm text-gray-500 line-clamp-2">{r.text}</p>
            </div>
          )},
          { key: 'user', label: 'User', render: r => (
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{r.userName || 'Anonymous'}</p>
              <p className="text-xs text-gray-400">{r.productId}</p>
            </div>
          )},
          { key: 'date', label: 'Date', render: r => <span className="text-sm text-gray-500">{r.date || 'N/A'}</span> },
        ]}
        data={filtered}
        searchQuery={search}
        onSearchChange={setSearch}
        renderActions={r => (
          <button onClick={() => setConfirmDelete(r)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button>
        )}
      />
      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => handleDelete(confirmDelete)} />
    </div>
  )
}
