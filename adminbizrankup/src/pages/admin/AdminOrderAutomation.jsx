import { useState, useEffect } from 'react'
import { FiSave, FiCheck, FiX, FiExternalLink, FiPlay, FiClock, FiSmartphone, FiTruck, FiSettings, FiPhoneCall, FiMessageSquare, FiCpu, FiToggleLeft, FiToggleRight, FiTrash2, FiPlus } from 'react-icons/fi'

const SETTINGS_KEY = 'shajgoj_admin_automation'
const LOGS_KEY = 'shajgoj_admin_automation_logs'

const defaultSettings = {
  aiCalling: {
    enabled: false,
    elevenlabs: { apiKey: '', voiceId: '21m00Tcm4TlvDq8ikWAM', model: 'eleven_monolingual_v1' },
    twilio: { accountSid: '', authToken: '', phoneNumber: '' },
    gemini: { apiKey: '' },
    openai: { apiKey: '', model: 'gpt-4' },
    callMessage: 'Hello, this is an automated call from SHAJGOJ. Your order has been placed. Please press 1 to confirm or 2 to cancel.',
    retryCount: 2,
    retryDelay: 5,
  },
  autoParcel: {
    enabled: false,
    courier: 'steadfast',
    defaultNotes: 'Auto-created from order automation',
    markAsShipped: true,
  },
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings
  } catch { return defaultSettings }
}

function loadLogs() {
  try {
    const raw = localStorage.getItem(LOGS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export default function AdminOrderAutomation() {
  const [activeTab, setActiveTab] = useState('settings')
  const [settings, setSettings] = useState(loadSettings)
  const [logs, setLogs] = useState(loadLogs)
  const [saved, setSaved] = useState({})
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(null)
  const [running, setRunning] = useState(false)
  const [simForm, setSimForm] = useState({ customer: '', phone: '', itemName: '', itemPrice: 29.99 })
  const [simProgress, setSimProgress] = useState(null)

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs))
  }, [logs])

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }))
  }

  const updateNestedSetting = (section, subsection, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: { ...prev[section]?.[subsection], [key]: value },
      },
    }))
  }

  const handleSave = (section) => {
    setSaved(prev => ({ ...prev, [section]: true }))
    setTimeout(() => setSaved(prev => ({ ...prev, [section]: false })), 2000)
  }

  const handleTest = async (service) => {
    setTesting(service)
    setTestResult(null)
    await new Promise(r => setTimeout(r, 2000))
    const cfg = settings.aiCalling
    let success = false
    let msg
    switch (service) {
      case 'elevenlabs':
        success = !!cfg.elevenlabs.apiKey
        msg = success ? 'ElevenLabs API connected successfully!' : 'Please enter an API Key.'
        break
      case 'twilio':
        success = !!(cfg.twilio.accountSid && cfg.twilio.authToken && cfg.twilio.phoneNumber)
        msg = success ? 'Twilio connected successfully!' : 'Please fill in all Twilio fields.'
        break
      case 'gemini':
        success = !!cfg.gemini.apiKey
        msg = success ? 'Gemini API connected successfully!' : 'Please enter an API Key.'
        break
      case 'openai':
        success = !!cfg.openai.apiKey
        msg = success ? 'OpenAI API connected successfully!' : 'Please enter an API Key.'
        break
      default:
        msg = 'Unknown service'
    }
    setTestResult({ success, message: msg })
    setTesting(null)
  }

  const addLog = (entry) => {
    setLogs(prev => [{ id: Date.now(), timestamp: new Date().toLocaleString(), ...entry }, ...prev])
  }

  const clearLogs = () => {
    setLogs([])
  }

  const simulateOrder = async () => {
    if (!simForm.customer || !simForm.phone) return
    setRunning(true)
    const orderId = Math.floor(Math.random() * 9000) + 1000
    addLog({
      type: 'order_placed',
      orderId,
      customer: simForm.customer,
      phone: simForm.phone,
      status: 'Order Placed',
      details: `Order #${orderId} placed for ${simForm.customer}`,
    })

    setSimProgress({ step: 'Placing order...', orderId })

    await new Promise(r => setTimeout(r, 1500))
    setSimProgress({ step: 'Checking automation rules...', orderId })

    await new Promise(r => setTimeout(r, 800))

    if (settings.aiCalling.enabled) {
      setSimProgress({ step: 'Initiating AI-powered phone call...', orderId })
      addLog({
        type: 'call_initiated',
        orderId,
        customer: simForm.customer,
        phone: simForm.phone,
        status: 'Call Initiated',
        details: `Auto-call via Twilio+ElevenLabs to ${simForm.phone}`,
      })

      await new Promise(r => setTimeout(r, 2000))
      setSimProgress({ step: 'AI is speaking with customer...', orderId })
      addLog({
        type: 'call_connected',
        orderId,
        customer: simForm.customer,
        phone: simForm.phone,
        status: 'Call Connected',
        details: `ElevenLabs voice + ${settings.aiCalling.openai.apiKey ? 'ChatGPT' : 'Gemini'} AI engaging customer`,
      })

      await new Promise(r => setTimeout(r, 2500))
      setSimProgress({ step: 'Customer confirmed order ✓', orderId })
      addLog({
        type: 'call_confirmed',
        orderId,
        customer: simForm.customer,
        phone: simForm.phone,
        status: 'Confirmed',
        details: 'Customer confirmed order via AI call',
      })
    } else {
      setSimProgress({ step: 'Auto-calling is disabled, skipping...', orderId })
      await new Promise(r => setTimeout(r, 1000))
    }

    if (settings.autoParcel.enabled && settings.aiCalling.enabled) {
      const courierName = settings.autoParcel.courier
      setSimProgress({ step: `Creating parcel in ${courierName}...`, orderId })

      await new Promise(r => setTimeout(r, 2000))
      const trackingId = `${courierName.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
      addLog({
        type: 'parcel_created',
        orderId,
        customer: simForm.customer,
        phone: simForm.phone,
        status: 'Parcel Created',
        details: `Parcel created in ${courierName}. Tracking: ${trackingId}`,
      })

      setSimProgress({ step: `Parcel created in ${courierName}! ✓`, orderId, trackingId })

      if (settings.autoParcel.markAsShipped) {
        await new Promise(r => setTimeout(r, 500))
        addLog({
          type: 'order_shipped',
          orderId,
          customer: simForm.customer,
          phone: simForm.phone,
          status: 'Shipped',
          details: `Order #${orderId} marked as Shipped with tracking ${trackingId}`,
        })
      }
    } else if (settings.autoParcel.enabled && !settings.aiCalling.enabled) {
      setSimProgress({ step: 'Creating parcel without confirmation...', orderId })
      await new Promise(r => setTimeout(r, 1500))
      const trackingId = `${settings.autoParcel.courier.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
      addLog({
        type: 'parcel_created',
        orderId,
        customer: simForm.customer,
        phone: simForm.phone,
        status: 'Parcel Created',
        details: `Parcel auto-created in ${settings.autoParcel.courier}. Tracking: ${trackingId}`,
      })
      setSimProgress({ step: `Parcel created! ✓`, orderId, trackingId })
    } else {
      setSimProgress({ step: 'Auto-parcel is disabled, skipping...', orderId })
    }

    await new Promise(r => setTimeout(r, 1000))
    addLog({
      type: 'completed',
      orderId,
      customer: simForm.customer,
      phone: simForm.phone,
      status: 'Completed',
      details: `Order #${orderId} automation flow completed`,
    })

    setSimProgress({ step: '✓ Automation flow complete!', orderId })
    setRunning(false)
  }

  const tabs = [
    { id: 'settings', label: 'AI Calling Settings', icon: FiPhoneCall },
    { id: 'parcel', label: 'Auto-Parcel Settings', icon: FiTruck },
    { id: 'logs', label: 'Automation Logs', icon: FiClock },
    { id: 'simulate', label: 'Simulate Order', icon: FiPlay },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Order Automation</h1>
          <p className="text-sm text-gray-500 mt-1">AI-powered auto-calling & auto-parcel system</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
            settings.aiCalling.enabled
              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
          }`}>
            <FiSmartphone className="w-3.5 h-3.5" />
            Auto-Call: {settings.aiCalling.enabled ? 'ON' : 'OFF'}
          </span>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
            settings.autoParcel.enabled
              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
          }`}>
            <FiTruck className="w-3.5 h-3.5" />
            Auto-Parcel: {settings.autoParcel.enabled ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 mb-6 scrollbar-hide">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white shadow-lg shadow-pink-500/25'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#FF4F8B] hover:text-[#FF4F8B]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab: AI Calling Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Enable/Disable */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl flex items-center justify-center">
                  <FiCpu className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Auto-Calling</h2>
                  <p className="text-xs text-gray-400">Automatically call customers to confirm orders</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('aiCalling', 'enabled', !settings.aiCalling.enabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  settings.aiCalling.enabled
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                {settings.aiCalling.enabled ? <FiToggleRight className="w-4 h-4" /> : <FiToggleLeft className="w-4 h-4" />}
                {settings.aiCalling.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* ElevenLabs */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-xl flex items-center justify-center">
                  <FiMessageSquare className="w-5 h-5 text-indigo-500" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">ElevenLabs (AI Voice)</h3>
              </div>
              <a href="https://elevenlabs.io/docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-[#FF4F8B] hover:underline">
                Docs <FiExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">API Key</label>
                <input type="password" value={settings.aiCalling.elevenlabs.apiKey} onChange={e => updateNestedSetting('aiCalling', 'elevenlabs', 'apiKey', e.target.value)} placeholder="Enter ElevenLabs API Key" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Voice ID</label>
                <input type="text" value={settings.aiCalling.elevenlabs.voiceId} onChange={e => updateNestedSetting('aiCalling', 'elevenlabs', 'voiceId', e.target.value)} placeholder="21m00Tcm4TlvDq8ikWAM" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Model</label>
                <input type="text" value={settings.aiCalling.elevenlabs.model} onChange={e => updateNestedSetting('aiCalling', 'elevenlabs', 'model', e.target.value)} placeholder="eleven_monolingual_v1" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors font-mono" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { handleSave('elevenlabs'); handleTest('elevenlabs') }} disabled={testing === 'elevenlabs'} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all disabled:opacity-60">
                {testing === 'elevenlabs' ? 'Testing...' : 'Test & Save'}
              </button>
              {saved.elevenlabs && <FiCheck className="w-4 h-4 text-green-500" />}
            </div>
          </div>

          {/* Twilio */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl flex items-center justify-center">
                  <FiSmartphone className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Twilio (Phone Calls)</h3>
              </div>
              <a href="https://www.twilio.com/docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-[#FF4F8B] hover:underline">
                Docs <FiExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Account SID</label>
                <input type="password" value={settings.aiCalling.twilio.accountSid} onChange={e => updateNestedSetting('aiCalling', 'twilio', 'accountSid', e.target.value)} placeholder="ACxxxxxxxxxxxx" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Auth Token</label>
                <input type="password" value={settings.aiCalling.twilio.authToken} onChange={e => updateNestedSetting('aiCalling', 'twilio', 'authToken', e.target.value)} placeholder="Enter Auth Token" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone Number</label>
                <input type="text" value={settings.aiCalling.twilio.phoneNumber} onChange={e => updateNestedSetting('aiCalling', 'twilio', 'phoneNumber', e.target.value)} placeholder="+1234567890" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors font-mono" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { handleSave('twilio'); handleTest('twilio') }} disabled={testing === 'twilio'} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all disabled:opacity-60">
                {testing === 'twilio' ? 'Testing...' : 'Test & Save'}
              </button>
              {saved.twilio && <FiCheck className="w-4 h-4 text-green-500" />}
            </div>
          </div>

          {/* AI Models */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Gemini */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl flex items-center justify-center">
                    <FiCpu className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Google Gemini</h3>
                </div>
                <a href="https://ai.google.dev/docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-[#FF4F8B] hover:underline">
                  Docs <FiExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">API Key</label>
                <input type="password" value={settings.aiCalling.gemini.apiKey} onChange={e => updateNestedSetting('aiCalling', 'gemini', 'apiKey', e.target.value)} placeholder="Enter Gemini API Key" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors font-mono" />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => { handleSave('gemini'); handleTest('gemini') }} disabled={testing === 'gemini'} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all disabled:opacity-60">
                  {testing === 'gemini' ? 'Testing...' : 'Test & Save'}
                </button>
                {saved.gemini && <FiCheck className="w-4 h-4 text-green-500" />}
              </div>
            </div>

            {/* OpenAI/ChatGPT */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500/10 to-green-500/10 rounded-xl flex items-center justify-center">
                    <FiMessageSquare className="w-5 h-5 text-teal-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">OpenAI (ChatGPT)</h3>
                </div>
                <a href="https://platform.openai.com/docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-[#FF4F8B] hover:underline">
                  Docs <FiExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">API Key</label>
                  <input type="password" value={settings.aiCalling.openai.apiKey} onChange={e => updateNestedSetting('aiCalling', 'openai', 'apiKey', e.target.value)} placeholder="sk-..." className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Model</label>
                  <input type="text" value={settings.aiCalling.openai.model} onChange={e => updateNestedSetting('aiCalling', 'openai', 'model', e.target.value)} placeholder="gpt-4" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors font-mono" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => { handleSave('openai'); handleTest('openai') }} disabled={testing === 'openai'} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all disabled:opacity-60">
                  {testing === 'openai' ? 'Testing...' : 'Test & Save'}
                </button>
                {saved.openai && <FiCheck className="w-4 h-4 text-green-500" />}
              </div>
            </div>
          </div>

          {/* Call Settings */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-xl flex items-center justify-center">
                <FiSettings className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Call Configuration</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">AI Call Message</label>
                <textarea value={settings.aiCalling.callMessage} onChange={e => updateSetting('aiCalling', 'callMessage', e.target.value)} rows={3} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Retry Count</label>
                  <input type="number" min={0} max={5} value={settings.aiCalling.retryCount} onChange={e => updateSetting('aiCalling', 'retryCount', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Retry Delay (minutes)</label>
                  <input type="number" min={1} max={60} value={settings.aiCalling.retryDelay} onChange={e => updateSetting('aiCalling', 'retryDelay', parseInt(e.target.value) || 5)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button onClick={() => handleSave('callConfig')} className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
                <FiSave className="w-4 h-4" /> {saved.callConfig ? 'Saved!' : 'Save Settings'}
              </button>
              {saved.callConfig && <FiCheck className="w-4 h-4 text-green-500 ml-2" />}
            </div>
          </div>

          {testResult && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
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

      {/* Tab: Auto-Parcel Settings */}
      {activeTab === 'parcel' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl flex items-center justify-center">
                  <FiTruck className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Auto-Parcel Creation</h2>
                  <p className="text-xs text-gray-400">Automatically create parcels in courier after order confirmation</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('autoParcel', 'enabled', !settings.autoParcel.enabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  settings.autoParcel.enabled
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                {settings.autoParcel.enabled ? <FiToggleRight className="w-4 h-4" /> : <FiToggleLeft className="w-4 h-4" />}
                {settings.autoParcel.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Select Courier</label>
                <select value={settings.autoParcel.courier} onChange={e => updateSetting('autoParcel', 'courier', e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors">
                  <option value="steadfast">Steadfast Courier</option>
                  <option value="redx">RedX</option>
                  <option value="pathao">Pathao Courier</option>
                  <option value="ecourier">eCourier</option>
                  <option value="sundarban">Sundarban Courier</option>
                  <option value="paperfly">Paperfly</option>
                  <option value="saparibahan">S.A. Paribahan</option>
                  <option value="shipstation">ShipStation</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Default Parcel Notes</label>
                <textarea value={settings.autoParcel.defaultNotes} onChange={e => updateSetting('autoParcel', 'defaultNotes', e.target.value)} rows={2} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="markAsShipped" checked={settings.autoParcel.markAsShipped} onChange={e => updateSetting('autoParcel', 'markAsShipped', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#FF4F8B] focus:ring-[#FF4F8B]" />
                <label htmlFor="markAsShipped" className="text-sm text-gray-700 dark:text-gray-300">Mark order as Shipped after parcel creation</label>
              </div>
            </div>

            <div className="mt-5">
              <button onClick={() => handleSave('parcel')} className="flex items-center gap-1.5 px-5 py-2.5 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all">
                <FiSave className="w-4 h-4" /> {saved.parcel ? 'Saved!' : 'Save Settings'}
              </button>
              {saved.parcel && <FiCheck className="w-4 h-4 text-green-500 ml-2" />}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">How Auto-Parcel Works</h3>
            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5 list-decimal list-inside">
              <li>Customer places an order</li>
              <li>AI auto-call is initiated to confirm the order</li>
              <li>Customer confirms via voice (press 1 or voice confirmation)</li>
              <li>Parcel is automatically created in your selected courier</li>
              <li>Order status is updated to Shipped with tracking number</li>
              <li>Customer receives notification with tracking info</li>
            </ol>
          </div>
        </div>
      )}

      {/* Tab: Automation Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-gray-900 dark:text-white">Automation Logs ({logs.length})</h2>
            <button onClick={clearLogs} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
              <FiTrash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>
          {logs.length === 0 ? (
            <div className="p-10 text-center">
              <FiClock className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No automation logs yet.</p>
              <p className="text-xs text-gray-400 mt-1">Go to Simulate Order to test the automation flow.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {logs.map(log => {
                const typeColors = {
                  order_placed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                  call_initiated: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                  call_connected: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
                  call_confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
                  parcel_created: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
                  order_shipped: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
                  completed: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
                }
                return (
                  <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className={`shrink-0 w-2 h-2 mt-2 rounded-full ${log.status === 'Confirmed' || log.status === 'Completed' || log.status === 'Parcel Created' ? 'bg-green-500' : log.status === 'Call Initiated' || log.status === 'Call Connected' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${typeColors[log.type] || 'bg-gray-100 text-gray-600'}`}>{log.type.replace(/_/g, ' ')}</span>
                          <span className="text-xs font-medium text-gray-900 dark:text-white">Order #{log.orderId}</span>
                          <span className="text-xs text-gray-500">{log.customer}</span>
                          {log.phone && <span className="text-xs text-gray-400 font-mono">{log.phone}</span>}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{log.details}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{log.timestamp}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Simulate Order */}
      {activeTab === 'simulate' && (
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl flex items-center justify-center">
                  <FiPlus className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Test Order</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Customer Name</label>
                  <input type="text" value={simForm.customer} onChange={e => setSimForm(prev => ({ ...prev, customer: e.target.value }))} placeholder="John Doe" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone Number</label>
                  <input type="text" value={simForm.phone} onChange={e => setSimForm(prev => ({ ...prev, phone: e.target.value }))} placeholder="+88017XXXXXXXX" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Item Name</label>
                  <input type="text" value={simForm.itemName} onChange={e => setSimForm(prev => ({ ...prev, itemName: e.target.value }))} placeholder="Product name" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Item Price ($)</label>
                  <input type="number" step="0.01" value={simForm.itemPrice} onChange={e => setSimForm(prev => ({ ...prev, itemPrice: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
                </div>
                <button
                  onClick={simulateOrder}
                  disabled={running || !simForm.customer || !simForm.phone}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white text-sm font-bold rounded-xl hover:from-[#e64579] hover:to-[#e64579] active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-pink-500/25"
                >
                  {running ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                  ) : (
                    <><FiPlay className="w-4 h-4" /> Place Order & Trigger Automation</>
                  )}
                </button>
              </div>
              <div className="mt-4 text-xs text-gray-400 space-y-1">
                <p className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${settings.aiCalling.enabled ? 'bg-green-500' : 'bg-gray-300'}`} /> Auto-Call: {settings.aiCalling.enabled ? 'Enabled' : 'Disabled'}</p>
                <p className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${settings.autoParcel.enabled ? 'bg-green-500' : 'bg-gray-300'}`} /> Auto-Parcel: {settings.autoParcel.enabled ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 min-h-[300px]">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Automation Progress</h3>
              {simProgress ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#FF4F8B]/5 to-purple-500/5 rounded-xl border border-[#FF4F8B]/10">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF4F8B] to-[#FF6B9D] rounded-xl flex items-center justify-center animate-pulse">
                      <FiCpu className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Order #{simProgress.orderId}</p>
                      <p className="text-sm text-gray-500">{simProgress.step}</p>
                      {simProgress.trackingId && (
                        <p className="text-xs font-mono text-[#FF4F8B] mt-1">Tracking: {simProgress.trackingId}</p>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] rounded-full transition-all duration-500" style={{
                      width: simProgress.step.includes('✓') ? '100%' : simProgress.step.includes('Placing') ? '10%' : simProgress.step.includes('checking') ? '20%' : simProgress.step.includes('Initiating') ? '30%' : simProgress.step.includes('speaking') ? '50%' : simProgress.step.includes('confirmed') ? '65%' : simProgress.step.includes('Creating') ? '80%' : simProgress.step.includes('disabled') || simProgress.step.includes('skipping') ? '85%' : '90%'
                    }} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiPlay className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Enter customer details and click</p>
                  <p className="text-sm text-gray-400">"Place Order & Trigger Automation"</p>
                  <p className="text-xs text-gray-400 mt-2">to see the full automation flow in action</p>
                </div>
              )}

              {/* Automation flow diagram */}
              {!simProgress && (
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Automation Flow</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">Order Placed</span>
                    <span className="text-gray-300">→</span>
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">AI Auto-Call</span>
                    <span className="text-gray-300">→</span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">Customer Confirms</span>
                    <span className="text-gray-300">→</span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">Parcel Created</span>
                    <span className="text-gray-300">→</span>
                    <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">Order Shipped</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
