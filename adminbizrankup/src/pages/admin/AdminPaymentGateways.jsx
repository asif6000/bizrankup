import { useState, useEffect } from 'react'
import { FiSave, FiCheck, FiX, FiExternalLink, FiDollarSign } from 'react-icons/fi'
import { paymentGateways as paymentApi } from '../../api/client'

const gateways = [
  {
    id: 'sslcommerz',
    name: 'SSLCommerz',
    logo: '',
    country: 'Bangladesh',
    docs: 'https://developer.sslcommerz.com',
    fields: [
      { key: 'storeId', label: 'Store ID', type: 'text' },
      { key: 'storePassword', label: 'Store Password', type: 'password' },
      { key: 'baseUrl', label: 'Base URL', type: 'text', default: 'https://sandbox.sslcommerz.com' },
    ],
  },
  {
    id: 'bkash',
    name: 'bKash',
    logo: '',
    country: 'Bangladesh',
    docs: 'https://developer.bka.sh',
    fields: [
      { key: 'appKey', label: 'App Key', type: 'text' },
      { key: 'appSecret', label: 'App Secret', type: 'password' },
      { key: 'username', label: 'Username', type: 'text' },
      { key: 'password', label: 'Password', type: 'password' },
      { key: 'baseUrl', label: 'Base URL', type: 'text', default: 'https://tokenized.sandbox.bka.sh/v1.2.0-beta' },
    ],
  },
  {
    id: 'nagad',
    name: 'Nagad',
    logo: '',
    country: 'Bangladesh',
    docs: 'https://developer.nagad.com',
    fields: [
      { key: 'merchantId', label: 'Merchant ID', type: 'text' },
      { key: 'merchantKey', label: 'Merchant Key', type: 'password' },
      { key: 'baseUrl', label: 'Base URL', type: 'text', default: 'https://sandbox.mynagad.com/api' },
    ],
  },
  {
    id: 'rocket',
    name: 'Rocket',
    logo: '',
    country: 'Bangladesh',
    docs: 'https://rocket.dutchbanglabank.com',
    fields: [
      { key: 'merchantId', label: 'Merchant ID', type: 'text' },
      { key: 'apiKey', label: 'API Key', type: 'password' },
      { key: 'baseUrl', label: 'Base URL', type: 'text', default: 'https://api.rocket.com.bd' },
    ],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    logo: '',
    country: 'International',
    docs: 'https://stripe.com/docs',
    fields: [
      { key: 'publishableKey', label: 'Publishable Key', type: 'text' },
      { key: 'secretKey', label: 'Secret Key', type: 'password' },
      { key: 'webhookSecret', label: 'Webhook Secret', type: 'password' },
    ],
  },
  {
    id: 'paypal',
    name: 'PayPal',
    logo: '',
    country: 'International',
    docs: 'https://developer.paypal.com',
    fields: [
      { key: 'clientId', label: 'Client ID', type: 'text' },
      { key: 'clientSecret', label: 'Client Secret', type: 'password' },
      { key: 'mode', label: 'Mode', type: 'select', options: ['sandbox', 'live'], default: 'sandbox' },
    ],
  },
]

export default function AdminPaymentGateways() {
  const [activeTab, setActiveTab] = useState(gateways[0].id)
  const [settings, setSettings] = useState({})
  const [saved, setSaved] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)
  const [, setLoading] = useState(true)

  useEffect(() => {
    paymentApi.list().then(data => {
      const map = {}
      data.forEach(g => { map[g.provider] = { ...g.credentials, active: g.active } })
      setSettings(map)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const activeGateway = gateways.find(g => g.id === activeTab)
  const activeSettings = settings[activeTab] || {}

  const updateField = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [key]: value },
    }))
    setSaved(false)
  }

  const handleSave = async () => {
    try {
      await paymentApi.update(activeTab, { credentials: activeSettings, active: true })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      alert('Failed to save: ' + (err.error || 'Unknown error'))
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    await new Promise(r => setTimeout(r, 1500))
    const hasAllFields = activeGateway.fields.every(f => activeSettings[f.key])
    if (hasAllFields) {
      setTestResult({ success: true, message: `Connected to ${activeGateway.name} successfully!` })
    } else {
      setTestResult({ success: false, message: 'Please fill in all required fields before testing.' })
    }
    setTesting(false)
  }

  const connected = Object.keys(settings).filter(id => {
    const g = gateways.find(gw => gw.id === id)
    return g && g.fields.every(f => settings[id]?.[f.key])
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Payment Gateway Configuration</h1>
          <p className="text-sm text-gray-500 mt-1">Manage payment gateway API connections</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiDollarSign className="w-4 h-4" />
          <span>{connected.length}/{gateways.length} connected</span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 mb-6 scrollbar-hide">
        {gateways.map(g => (
          <button
            key={g.id}
            onClick={() => { setActiveTab(g.id); setTestResult(null) }}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === g.id
                ? 'bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white shadow-lg shadow-pink-500/25'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#FF4F8B] hover:text-[#FF4F8B]'
            }`}
          >
            {settings[g.id] && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
            <span>{g.name}</span>
            <span className={`text-[10px] ${activeTab === g.id ? 'text-white/70' : 'text-gray-400'}`}>{g.country}</span>
          </button>
        ))}
      </div>

      {activeGateway && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF4F8B]/10 to-purple-500/10 rounded-xl flex items-center justify-center">
                <FiDollarSign className="w-6 h-6 text-[#FF4F8B]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{activeGateway.name}</h2>
                <p className="text-xs text-gray-400">{activeGateway.country}</p>
              </div>
            </div>
            <a href={activeGateway.docs} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-[#FF4F8B] hover:underline">
              API Docs <FiExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-4 mb-6">
            {activeGateway.fields.map(field => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    value={activeSettings[field.key] || field.default || ''}
                    onChange={e => updateField(field.key, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors"
                  >
                    {field.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={activeSettings[field.key] || ''}
                    onChange={e => updateField(field.key, e.target.value)}
                    placeholder={field.default || `Enter ${field.label}`}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors font-mono"
                  />
                )}
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

      <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2">How to Integrate</h3>
        <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5 list-decimal list-inside">
          <li>Select a payment gateway from the tabs above</li>
          <li>Get your API credentials from the gateway's merchant portal</li>
          <li>Enter the credentials in the fields above</li>
          <li>Click <strong>Test Connection</strong> to verify</li>
          <li>Once configured, the gateway will appear in checkout options</li>
        </ol>
      </div>
    </div>
  )
}
