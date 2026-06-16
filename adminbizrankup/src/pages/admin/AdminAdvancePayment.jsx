import { useState, useEffect } from 'react'
import { advancePayment as api } from '../../api/client'
import { FiCreditCard, FiSave, FiToggleLeft, FiToggleRight } from 'react-icons/fi'

export default function AdminAdvancePayment() {
  const [config, setConfig] = useState({ active: false, credentials: { threshold: 1000 } })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    api.get().then(res => {
      setConfig({ active: res.active, credentials: res.credentials || { threshold: 1000 } })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const toggle = () => setConfig(prev => ({ ...prev, active: !prev.active }))

  const setThreshold = (e) => {
    const val = Number(e.target.value)
    setConfig(prev => ({ ...prev, credentials: { ...prev.credentials, threshold: val } }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMsg(null)
    try {
      await api.update({ active: config.active, credentials: config.credentials })
      setMsg({ type: 'success', text: 'Settings saved successfully!' })
    } catch {
      setMsg({ type: 'error', text: 'Failed to save settings.' })
    }
    setSaving(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#FF4F8B] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FiCreditCard className="w-6 h-6 text-[#FF4F8B]" />
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Advance Payment</h1>
          <p className="text-sm text-gray-500">Require advance payment for orders above a threshold</p>
        </div>
      </div>

      {msg && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
          {msg.text}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Enable Advance Payment</h3>
            <p className="text-sm text-gray-500 mt-0.5">When enabled, users must pay online for orders above the threshold</p>
          </div>
          <button onClick={toggle} className={`relative w-14 h-7 rounded-full transition-colors ${config.active ? 'bg-[#FF4F8B]' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${config.active ? 'translate-x-7' : ''}`} />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Threshold Amount (৳)</label>
          <input
            type="number"
            value={config.credentials.threshold}
            onChange={setThreshold}
            min="0"
            className="w-full max-w-xs px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1.5">Orders with total above this amount will require advance payment</p>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all disabled:opacity-50">
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {config.active && (
        <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            Advance payment is <strong>enabled</strong>. Users will be required to pay online for orders above ৳{config.credentials.threshold}.
          </p>
        </div>
      )}
    </div>
  )
}
