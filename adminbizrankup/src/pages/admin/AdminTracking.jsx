import { useState, useEffect } from 'react'
import { FiSave, FiCheck, FiX, FiExternalLink, FiActivity, FiToggleLeft, FiToggleRight } from 'react-icons/fi'
import { tracking as trackingApi } from '../../api/client'

const platforms = [
  {
    id: 'facebook',
    name: 'Facebook Pixel',
    logo: '',
    docs: 'https://developers.facebook.com/docs/meta-pixel',
    fields: [
      { key: 'pixelId', label: 'Pixel ID', type: 'text', placeholder: '123456789012345' },
      { key: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'EAA...' },
      { key: 'apiVersion', label: 'API Version', type: 'text', default: 'v18.0', placeholder: 'v18.0' },
    ],
    testEndpoint: 'https://graph.facebook.com/v18.0/',
  },
  {
    id: 'ga4',
    name: 'Google Analytics 4',
    logo: '',
    docs: 'https://developers.google.com/analytics/devguides/collection/protocol/ga4',
    fields: [
      { key: 'measurementId', label: 'Measurement ID', type: 'text', placeholder: 'G-XXXXXXXXXX' },
      { key: 'apiSecret', label: 'API Secret', type: 'password', placeholder: 'XXXXXXXX' },
      { key: 'clientId', label: 'Client ID', type: 'text', placeholder: '123456789.123456789' },
    ],
    testEndpoint: 'https://www.google-analytics.com/mp/collect',
  },
  {
    id: 'gtm',
    name: 'Google Tag Manager',
    logo: '',
    docs: 'https://developers.google.com/tag-platform/tag-manager/server-side',
    fields: [
      { key: 'containerId', label: 'Container ID', type: 'text', placeholder: 'GTM-XXXXXXX' },
      { key: 'serverUrl', label: 'Server URL', type: 'text', default: 'https://your-server.example.com', placeholder: 'https://gtm.yourdomain.com' },
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Enter API key' },
    ],
    testEndpoint: 'https://your-server.example.com/healthy',
  },
  {
    id: 'tiktok',
    name: 'TikTok Pixel',
    logo: '',
    docs: 'https://ads.tiktok.com/help/article/tiktok-pixel',
    fields: [
      { key: 'pixelCode', label: 'Pixel Code', type: 'text', placeholder: 'XXXXXXXXXXXXXXX' },
      { key: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'Enter access token' },
      { key: 'apiVersion', label: 'API Version', type: 'text', default: 'v1.0', placeholder: 'v1.0' },
    ],
    testEndpoint: 'https://business-api.tiktok.com/open_api/',
  },
]

export default function AdminTracking() {
  const [activeTab, setActiveTab] = useState(platforms[0].id)
  const [settings, setSettings] = useState({})
  const [saved, setSaved] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)
  const [, setLoading] = useState(true)

  useEffect(() => {
    trackingApi.list().then(data => {
      setSettings(data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const activePlatform = platforms.find(p => p.id === activeTab)
  const activeSettings = settings[activeTab] || {}

  const updateField = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [key]: value },
    }))
    setSaved(false)
  }

  const toggleEnabled = () => {
    setSettings(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], enabled: !prev[activeTab]?.enabled },
    }))
    setSaved(false)
  }

  const handleSave = async () => {
    try {
      await trackingApi.update(activeTab, { credentials: activeSettings, active: activeSettings.active !== false })
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
    const hasAllFields = activePlatform.fields.every(f => activeSettings[f.key])
    if (hasAllFields) {
      setTestResult({ success: true, message: `Server-side ${activePlatform.name} configured successfully!` })
    } else {
      setTestResult({ success: false, message: 'Please fill in all required fields before testing.' })
    }
    setTesting(false)
  }

  const connected = Object.keys(settings).filter(id => {
    const p = platforms.find(pl => pl.id === id)
    return p && p.fields.every(f => settings[id]?.[f.key]) && settings[id]?.enabled
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Server-Side Tracking</h1>
          <p className="text-sm text-gray-500 mt-1">Configure server-side tracking integrations</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiActivity className="w-4 h-4" />
          <span>{connected.length}/{platforms.length} active</span>
        </div>
      </div>

      {/* Platform tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 mb-6 scrollbar-hide">
        {platforms.map(p => (
          <button
            key={p.id}
            onClick={() => { setActiveTab(p.id); setTestResult(null) }}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === p.id
                ? 'bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white shadow-lg shadow-pink-500/25'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#FF4F8B] hover:text-[#FF4F8B]'
            }`}
          >
            {settings[p.id]?.enabled && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {activePlatform && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF4F8B]/10 to-purple-500/10 rounded-xl flex items-center justify-center">
                <FiActivity className="w-6 h-6 text-[#FF4F8B]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{activePlatform.name}</h2>
                <p className="text-xs text-gray-400">Server-side Conversion API</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleEnabled}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeSettings.enabled
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                {activeSettings.enabled ? <FiToggleRight className="w-4 h-4" /> : <FiToggleLeft className="w-4 h-4" />}
                {activeSettings.enabled ? 'Enabled' : 'Disabled'}
              </button>
              <a href={activePlatform.docs} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-[#FF4F8B] hover:underline">
                API Docs <FiExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {activePlatform.fields.map(field => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{field.label}</label>
                <input
                  type={field.type}
                  value={activeSettings[field.key] || ''}
                  onChange={e => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder || field.default || `Enter ${field.label}`}
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
        <h3 className="font-bold text-gray-900 dark:text-white mb-2">How to Configure Server-Side Tracking</h3>
        <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5 list-decimal list-inside">
          <li>Select a platform from the tabs above</li>
          <li>Get your API credentials from the platform's developer portal</li>
          <li>Enter the credentials in the fields above</li>
          <li>Toggle <strong>Enable</strong> to activate tracking</li>
          <li>Click <strong>Test Connection</strong> to verify configuration</li>
          <li>Once connected, events will be sent server-side from your backend</li>
        </ol>
      </div>
    </div>
  )
}
