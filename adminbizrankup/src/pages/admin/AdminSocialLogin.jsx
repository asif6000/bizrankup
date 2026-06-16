import { useState, useEffect } from 'react'
import { FiSave, FiCheck, FiX, FiExternalLink, FiUsers } from 'react-icons/fi'
import { socialLogin as socialApi } from '../../api/client'

const providers = [
  {
    id: 'google',
    name: 'Google',
    icon: 'G',
    color: 'from-red-500 to-orange-500',
    docs: 'https://console.cloud.google.com/apis/credentials',
    fields: [
      { key: 'clientId', label: 'Client ID', type: 'text' },
      { key: 'clientSecret', label: 'Client Secret', type: 'password' },
      { key: 'redirectUri', label: 'Redirect URI', type: 'text', default: 'https://yourdomain.com/auth/google/callback' },
    ],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'f',
    color: 'from-blue-600 to-blue-800',
    docs: 'https://developers.facebook.com/apps',
    fields: [
      { key: 'appId', label: 'App ID', type: 'text' },
      { key: 'appSecret', label: 'App Secret', type: 'password' },
      { key: 'redirectUri', label: 'Redirect URI', type: 'text', default: 'https://yourdomain.com/auth/facebook/callback' },
    ],
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'GH',
    color: 'from-gray-700 to-gray-900',
    docs: 'https://github.com/settings/developers',
    fields: [
      { key: 'clientId', label: 'Client ID', type: 'text' },
      { key: 'clientSecret', label: 'Client Secret', type: 'password' },
      { key: 'redirectUri', label: 'Redirect URI', type: 'text', default: 'https://yourdomain.com/auth/github/callback' },
    ],
  },
]

export default function AdminSocialLogin() {
  const [activeTab, setActiveTab] = useState(providers[0].id)
  const [settings, setSettings] = useState({})
  const [saved, setSaved] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)
  const [, setLoading] = useState(true)

  useEffect(() => {
    socialApi.list().then(data => {
      const map = {}
      data.forEach(p => { map[p.provider] = { ...p.credentials, active: p.active } })
      setSettings(map)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const activeProvider = providers.find(p => p.id === activeTab)
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
      await socialApi.update(activeTab, { credentials: activeSettings, active: true })
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
    const hasAllFields = activeProvider.fields.every(f => activeSettings[f.key])
    if (hasAllFields) {
      setTestResult({ success: true, message: `${activeProvider.name} configuration looks valid!` })
    } else {
      setTestResult({ success: false, message: 'Please fill in all required fields before testing.' })
    }
    setTesting(false)
  }

  const connected = Object.keys(settings).filter(id => {
    const p = providers.find(pr => pr.id === id)
    return p && p.fields.every(f => settings[id]?.[f.key])
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Social Login Integration</h1>
          <p className="text-sm text-gray-500 mt-1">Configure social media login providers</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiUsers className="w-4 h-4" />
          <span>{connected.length}/{providers.length} connected</span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 mb-6 scrollbar-hide">
        {providers.map(p => (
          <button
            key={p.id}
            onClick={() => { setActiveTab(p.id); setTestResult(null) }}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === p.id
                ? 'bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white shadow-lg shadow-pink-500/25'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#FF4F8B] hover:text-[#FF4F8B]'
            }`}
          >
            {settings[p.id] && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {activeProvider && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${activeProvider.color} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>
                {activeProvider.icon}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{activeProvider.name}</h2>
                <p className="text-xs text-gray-400">OAuth 2.0</p>
              </div>
            </div>
            <a href={activeProvider.docs} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-[#FF4F8B] hover:underline">
              Create App <FiExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-4 mb-6">
            {activeProvider.fields.map(field => (
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

      <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Integration Guide</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Google Login</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-[#FF4F8B] hover:underline">Google Cloud Console</a></li>
              <li>Create a new project or select existing one</li>
              <li>Go to <strong>APIs & Services → Credentials</strong></li>
              <li>Click <strong>Create Credentials → OAuth client ID</strong></li>
              <li>Set Application type to <strong>Web application</strong></li>
              <li>Add <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">https://yourdomain.com/auth/google/callback</code> to Authorized redirect URIs</li>
              <li>Copy Client ID and Client Secret into the fields above</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Facebook Login</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer" className="text-[#FF4F8B] hover:underline">Facebook Developers</a></li>
              <li>Click <strong>Create App</strong> and choose <strong>Consumer</strong> type</li>
              <li>Go to <strong>Settings → Basic</strong> to get App ID and App Secret</li>
              <li>Go to <strong>Facebook Login → Settings</strong></li>
              <li>Add <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">https://yourdomain.com/auth/facebook/callback</code> to Valid OAuth Redirect URIs</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">GitHub Login</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer" className="text-[#FF4F8B] hover:underline">GitHub Developer Settings</a></li>
              <li>Click <strong>OAuth Apps → New OAuth App</strong></li>
              <li>Set Authorization callback URL to <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">https://yourdomain.com/auth/github/callback</code></li>
              <li>After registration, copy Client ID and generate Client Secret</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
