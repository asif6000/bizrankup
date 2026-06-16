import { useState, useRef } from 'react'
import { FiUpload, FiX, FiImage, FiLoader } from 'react-icons/fi'

function getToken() {
  try {
    const auth = localStorage.getItem('shajgoj_admin_auth')
    return auth ? JSON.parse(auth).token : null
  } catch { return null }
}

export default function ImageUpload({ value, onChange, label, folder }) {
  const [preview, setPreview] = useState(value || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Max 10MB.')
      return
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
    if (!allowed.includes(file.type)) {
      setError('Only JPEG, PNG, WebP, GIF, AVIF allowed.')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const token = getToken()
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      setPreview(data.url)
      onChange(data.url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div>
      {label && <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{label}</label>}
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800 shrink-0">
          {uploading ? (
            <FiLoader className="w-6 h-6 text-gray-300 animate-spin" />
          ) : preview ? (
            <img src={preview} alt="" className="w-full h-full object-cover" />
          ) : (
            <FiImage className="w-8 h-8 text-gray-300" />
          )}
        </div>
        <div className="flex-1">
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} hidden />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
            >
              {uploading ? (
                <><FiLoader className="w-4 h-4 animate-spin" /> Uploading...</>
              ) : (
                <><FiUpload className="w-4 h-4" /> Upload Image</>
              )}
            </button>
            {preview && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-medium rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
              >
                <FiX className="w-4 h-4" /> Remove
              </button>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG, WebP, GIF, AVIF. Max 10MB.</p>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          <input
            type="text"
            value={value || ''}
            onChange={e => { onChange(e.target.value); setPreview(e.target.value || null) }}
            placeholder="Or paste image URL directly"
            className="w-full px-3 py-1.5 mt-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs outline-none focus:border-[#FF4F8B] transition-colors"
          />
        </div>
      </div>
    </div>
  )
}
