import { useState, useEffect } from 'react'
import { FiShield, FiPlus, FiTrash2, FiSearch, FiAlertCircle, FiPhoneOff, FiGlobe } from 'react-icons/fi'

const BLOCKED_IPS_KEY = 'shajgoj_admin_blocked_ips'
const BLOCKED_NUMBERS_KEY = 'shajgoj_admin_blocked_numbers'

function load(key) {
  try { return JSON.parse(localStorage.getItem(key)) || [] } catch { return [] }
}

export default function AdminFraudChecker() {
  const [activeTab, setActiveTab] = useState('check')
  const [blockedIPs, setBlockedIPs] = useState(() => load(BLOCKED_IPS_KEY))
  const [blockedNumbers, setBlockedNumbers] = useState(() => load(BLOCKED_NUMBERS_KEY))
  const [ipInput, setIpInput] = useState('')
  const [numInput, setNumInput] = useState('')
  const [checkInput, setCheckInput] = useState('')
  const [checkResult, setCheckResult] = useState(null)
  const [logs, setLogs] = useState(() => load('shajgoj_admin_fraud_logs'))

  useEffect(() => { localStorage.setItem(BLOCKED_IPS_KEY, JSON.stringify(blockedIPs)) }, [blockedIPs])
  useEffect(() => { localStorage.setItem(BLOCKED_NUMBERS_KEY, JSON.stringify(blockedNumbers)) }, [blockedNumbers])
  useEffect(() => { localStorage.setItem('shajgoj_admin_fraud_logs', JSON.stringify(logs)) }, [logs])

  const addBlockedIP = () => {
    if (!ipInput || blockedIPs.includes(ipInput)) return
    setBlockedIPs(prev => [...prev, ipInput])
    addLog('ip_blocked', `IP ${ipInput} blocked`)
    setIpInput('')
  }

  const removeIP = (ip) => {
    setBlockedIPs(prev => prev.filter(i => i !== ip))
    addLog('ip_unblocked', `IP ${ip} unblocked`)
  }

  const addBlockedNumber = () => {
    if (!numInput || blockedNumbers.includes(numInput)) return
    setBlockedNumbers(prev => [...prev, numInput])
    addLog('number_blocked', `Number ${numInput} blocked`)
    setNumInput('')
  }

  const removeNumber = (num) => {
    setBlockedNumbers(prev => prev.filter(n => n !== num))
    addLog('number_unblocked', `Number ${num} unblocked`)
  }

  const addLog = (type, details) => {
    setLogs(prev => [{ id: Date.now(), type, details, timestamp: new Date().toLocaleString() }, ...prev].slice(0, 100))
  }

  const handleCheck = () => {
    if (!checkInput) return
    const isIP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(checkInput)
    const ipBlocked = blockedIPs.includes(checkInput)
    const numBlocked = blockedNumbers.includes(checkInput)
    const matchedIP = !isIP ? null : ipBlocked
    const matchedNum = isIP ? null : numBlocked
    setCheckResult({
      input: checkInput,
      type: isIP ? 'IP' : 'Number',
      blocked: isIP ? ipBlocked : numBlocked,
      details: isIP
        ? (ipBlocked ? 'This IP is blocked' : 'This IP is clean')
        : (numBlocked ? 'This number is blocked' : 'This number is clean'),
    })
    addLog('checked', `Checked ${checkInput} — ${isIP ? (ipBlocked ? 'BLOCKED' : 'clean') : (numBlocked ? 'BLOCKED' : 'clean')}`)
  }

  const tabs = [
    { id: 'check', label: 'Check', icon: FiSearch },
    { id: 'ip', label: 'Block IP', icon: FiGlobe },
    { id: 'number', label: 'Block Number', icon: FiPhoneOff },
    { id: 'logs', label: 'Logs', icon: FiShield },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Fraud Checker</h1>
          <p className="text-sm text-gray-500 mt-1">Block IPs & phone numbers, check orders for fraud</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg flex items-center gap-1"><FiGlobe className="w-3.5 h-3.5" /> {blockedIPs.length} IPs</span>
          <span className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg flex items-center gap-1"><FiPhoneOff className="w-3.5 h-3.5" /> {blockedNumbers.length} Numbers</span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 mb-6 scrollbar-hide">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white shadow-lg shadow-pink-500/25' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#FF4F8B] hover:text-[#FF4F8B]'}`}>
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'check' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Check IP or Phone Number</h3>
            <div className="flex gap-3">
              <input value={checkInput} onChange={e => setCheckInput(e.target.value)} placeholder="Enter IP address or phone number..." className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
              <button onClick={handleCheck} className="px-6 py-3 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all flex items-center gap-2"><FiSearch className="w-4 h-4" /> Check</button>
            </div>
            {checkResult && (
              <div className={`mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${checkResult.blocked ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`}>
                {checkResult.blocked ? <FiAlertCircle className="w-4 h-4 shrink-0" /> : <FiShield className="w-4 h-4 shrink-0" />}
                <div>
                  <p className="font-semibold">{checkResult.details}</p>
                  <p className="text-xs opacity-75">{checkResult.type}: {checkResult.input}</p>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Quick Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl text-center"><p className="text-2xl font-bold text-red-600">{blockedIPs.length}</p><p className="text-xs text-red-500 mt-1">Blocked IPs</p></div>
              <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl text-center"><p className="text-2xl font-bold text-red-600">{blockedNumbers.length}</p><p className="text-xs text-red-500 mt-1">Blocked Numbers</p></div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center"><p className="text-2xl font-bold text-gray-600">{logs.length}</p><p className="text-xs text-gray-500 mt-1">Total Logs</p></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ip' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex gap-3 mb-6">
            <input value={ipInput} onChange={e => setIpInput(e.target.value)} placeholder="e.g. 192.168.1.1" className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors font-mono" />
            <button onClick={addBlockedIP} className="px-5 py-3 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all flex items-center gap-2"><FiPlus className="w-4 h-4" /> Block IP</button>
          </div>
          {blockedIPs.length === 0 ? (
            <div className="text-center py-10"><FiGlobe className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" /><p className="text-sm text-gray-400">No blocked IPs</p></div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {blockedIPs.map(ip => (
                <div key={ip} className="flex items-center justify-between py-3"><span className="font-mono text-sm text-gray-900 dark:text-white">{ip}</span><button onClick={() => removeIP(ip)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button></div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'number' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex gap-3 mb-6">
            <input value={numInput} onChange={e => setNumInput(e.target.value)} placeholder="e.g. +88017XXXXXXXX" className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-[#FF4F8B] transition-colors font-mono" />
            <button onClick={addBlockedNumber} className="px-5 py-3 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all flex items-center gap-2"><FiPlus className="w-4 h-4" /> Block Number</button>
          </div>
          {blockedNumbers.length === 0 ? (
            <div className="text-center py-10"><FiPhoneOff className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" /><p className="text-sm text-gray-400">No blocked numbers</p></div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {blockedNumbers.map(num => (
                <div key={num} className="flex items-center justify-between py-3"><span className="font-mono text-sm text-gray-900 dark:text-white">{num}</span><button onClick={() => removeNumber(num)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"><FiTrash2 className="w-3.5 h-3.5" /></button></div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Fraud Check Logs</h3>
          {logs.length === 0 ? (
            <div className="text-center py-10"><FiShield className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" /><p className="text-sm text-gray-400">No logs yet</p></div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-96 overflow-y-auto">
              {logs.map(log => (
                <div key={log.id} className="flex items-start gap-3 py-3">
                  <span className={`shrink-0 w-2 h-2 mt-1.5 rounded-full ${log.type.includes('blocked') ? 'bg-red-500' : log.type === 'checked' ? 'bg-blue-500' : 'bg-green-500'}`} />
                  <div className="flex-1"><p className="text-sm text-gray-700 dark:text-gray-300">{log.details}</p><p className="text-[10px] text-gray-400 mt-0.5">{log.timestamp}</p></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
