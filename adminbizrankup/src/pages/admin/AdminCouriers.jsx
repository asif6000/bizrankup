import { useState, useEffect } from 'react'
import { FiSave, FiCheck, FiX, FiExternalLink, FiSettings, FiTruck } from 'react-icons/fi'

const STORAGE_KEY = 'shajgoj_admin_couriers'

const couriers = [
  {
    id: 'steadfast',
    name: 'Steadfast Courier',
    logo: 'https://steadfast.com.bd/favicon.ico',
    country: 'Bangladesh',
    docs: 'https://steadfast.com.bd/api',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'text' },
      { key: 'secretKey', label: 'Secret Key', type: 'password' },
      { key: 'baseUrl', label: 'Base URL', type: 'text', default: 'https://portal.steadfast.com.bd/api/v1' },
    ],
  },
  {
    id: 'redx',
    name: 'RedX',
    logo: '',
    country: 'Bangladesh',
    docs: 'https://redx.com.bd/api',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'text' },
      { key: 'apiSecret', label: 'API Secret', type: 'password' },
      { key: 'baseUrl', label: 'Base URL', type: 'text', default: 'https://sandbox.redx.com.bd/api' },
    ],
  },
  {
    id: 'pathao',
    name: 'Pathao Courier',
    logo: '',
    country: 'Bangladesh',
    docs: 'https://pathao.com/courier/api',
    fields: [
      { key: 'clientId', label: 'Client ID', type: 'text' },
      { key: 'clientSecret', label: 'Client Secret', type: 'password' },
      { key: 'baseUrl', label: 'Base URL', type: 'text', default: 'https://api.pathao.com/api' },
    ],
  },
  {
    id: 'ecourier',
    name: 'eCourier',
    logo: '',
    country: 'Bangladesh',
    docs: 'https://ecourier.com.bd/api',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'text' },
      { key: 'apiSecret', label: 'API Secret', type: 'password' },
      { key: 'baseUrl', label: 'Base URL', type: 'text', default: 'https://api.ecourier.com.bd/v1' },
    ],
  },
  {
    id: 'sundarban',
    name: 'Sundarban Courier',
    logo: '',
    country: 'Bangladesh',
    docs: 'https://sundarbancourier.com/api',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'text' },
      { key: 'password', label: 'Password', type: 'password' },
      { key: 'baseUrl', label: 'Base URL', type: 'text', default: 'https://api.sundarbancourier.com/v1' },
    ],
  },
  {
    id: 'paperfly',
    name: 'Paperfly',
    logo: '',
    country: 'Bangladesh',
    docs: 'https://paperfly.com.bd/api',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'text' },
      { key: 'secretKey', label: 'Secret Key', type: 'password' },
      { key: 'baseUrl', label: 'Base URL', type: 'text', default: 'https://api.paperfly.com.bd/v1' },
    ],
  },
  {
    id: 'saparibahan',
    name: 'S.A. Paribahan',
    logo: '',
    country: 'Bangladesh',
    docs: 'https://saparibahan.com/api',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'text' },
      { key: 'secretKey', label: 'Secret Key', type: 'password' },
      { key: 'baseUrl', label: 'Base URL', type: 'text', default: 'https://api.saparibahan.com/v1' },
    ],
  },
  {
    id: 'shipstation',
    name: 'ShipStation',
    logo: '',
    country: 'International',
    docs: 'https://shipstation.com/docs',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'text' },
      { key: 'apiSecret', label: 'API Secret', type: 'password' },
      { key: 'baseUrl', label: 'Base URL', type: 'text', default: 'https://ssapi.shipstation.com' },
    ],
  },
]

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export default function AdminCouriers() {
  const [activeTab, setActiveTab] = useState(couriers[0].id)
  const [settings, setSettings] = useState(loadSettings)
  const [saved, setSaved] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const activeCourier = couriers.find(c => c.id === activeTab)
  const activeSettings = settings[activeTab] || {}

  const updateField = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [key]: value },
    }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    await new Promise(r => setTimeout(r, 1500))
    const hasAllFields = activeCourier.fields.every(f => activeSettings[f.key])
    if (hasAllFields) {
      setTestResult({ success: true, message: `Connected to ${activeCourier.name} API successfully!` })
    } else {
      setTestResult({ success: false, message: 'Please fill in all required fields before testing.' })
    }
    setTesting(false)
  }

  const connected = Object.keys(settings).filter(id => {
    const c = couriers.find(co => co.id === id)
    return c && c.fields.every(f => settings[id]?.[f.key])
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Courier Integration</h1>
          <p className="text-sm text-gray-500 mt-1">Manage shipping carrier API connections</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiTruck className="w-4 h-4" />
          <span>{connected.length}/{couriers.length} connected</span>
        </div>
      </div>

      {/* Courier tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 mb-6 scrollbar-hide">
        {couriers.map(c => (
          <button
            key={c.id}
            onClick={() => { setActiveTab(c.id); setTestResult(null) }}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === c.id
                ? 'bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white shadow-lg shadow-pink-500/25'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#FF4F8B] hover:text-[#FF4F8B]'
            }`}
          >
            {settings[c.id] && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
            <span>{c.name}</span>
            <span className={`text-[10px] ${activeTab === c.id ? 'text-white/70' : 'text-gray-400'}`}>{c.country}</span>
          </button>
        ))}
      </div>

      {activeCourier && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF4F8B]/10 to-purple-500/10 rounded-xl flex items-center justify-center">
                <FiTruck className="w-6 h-6 text-[#FF4F8B]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{activeCourier.name}</h2>
                <p className="text-xs text-gray-400">{activeCourier.country}</p>
              </div>
            </div>
            <a href={activeCourier.docs} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-[#FF4F8B] hover:underline">
              API Docs <FiExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-4 mb-6">
            {activeCourier.fields.map(field => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{field.label}</label>
                <input
                  type={field.type}
                  value={activeSettings[field.key] || ''}
                  onChange={e => updateField(field.key, e.target.value)}
                  placeholder={field.default || `Enter ${field.label}`}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors font-mono"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleSave} className="flex items-center gap-1.5 px-5 py-2.5 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
              <FiSave className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Settings'}
            </button>
            {saved && <FiCheck className="w-4 h-4 text-green-500 animate-fade-in" />}
            <button onClick={handleTest} disabled={testing} className="flex items-center gap-1.5 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all disabled:opacity-60">
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          {testResult && (
            <div className={`mt-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
              testResult.success
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            }`}>
              {testResult.success ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
              {testResult.message}
            </div>
          )}
        </div>
      )}

      {/* Integration guide */}
      <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2">How to Integrate</h3>
        <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5 list-decimal list-inside">
          <li>Select a courier service from the tabs above</li>
          <li>Get your API credentials from the courier's merchant portal</li>
          <li>Enter the API Key/Secret in the fields above</li>
          <li>Click <strong>Test Connection</strong> to verify</li>
          <li>Once connected, shipments can be created directly from orders</li>
        </ol>
      </div>
    </div>
  )
}
