import { useState, useRef, useEffect } from 'react'
import { FiMessageCircle, FiX, FiSend, FiMinimize2 } from 'react-icons/fi'

const initialMessages = [
  { id: 1, text: 'Hi there! How can I help you today?', sender: 'bot', time: 'Just now' },
]

export default function ChatSupportWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [minimized, setMinimized] = useState(false)
  const bottomRef = useRef()

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), text: input, sender: 'user', time: 'Just now' }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: 'Thanks for reaching out! Our team will get back to you shortly. In the meantime, feel free to browse our FAQ page for quick answers.', sender: 'bot', time: 'Just now' }])
    }, 1000)
  }

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-20 md:bottom-8 right-6 z-40 w-14 h-14 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white rounded-full shadow-lg shadow-pink-500/25 hover:shadow-xl active:scale-90 transition-all flex items-center justify-center">
          <FiMessageCircle className="w-6 h-6" />
        </button>
      )}

      {open && (
        <div className={`fixed z-50 transition-all duration-300 ${minimized ? 'bottom-20 md:bottom-8 right-6' : 'bottom-20 md:bottom-8 right-6 w-[92vw] md:w-96'}`}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            {minimized ? (
              <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => setMinimized(false)}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FF4F8B] to-[#7C3AED] rounded-xl flex items-center justify-center"><FiMessageCircle className="w-4 h-4 text-white" /></div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Chat Support</span>
                </div>
                <button onClick={e => { e.stopPropagation(); setOpen(false) }} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><FiX className="w-4 h-4" /></button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-[#FF4F8B] to-[#7C3AED]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><FiMessageCircle className="w-5 h-5 text-white" /></div>
                    <div><p className="font-semibold text-sm text-white">Chat Support</p><p className="text-xs text-white/70">We typically reply in minutes</p></div>
                  </div>
                  <button onClick={() => setMinimized(true)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"><FiMinimize2 className="w-4 h-4 text-white" /></button>
                </div>

                <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white rounded-br-md' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-bl-md'}`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-white/60' : 'text-gray-400'}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                <div className="p-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                  <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm outline-none" onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                  <button onClick={sendMessage} className="w-10 h-10 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white rounded-xl flex items-center justify-center hover:shadow-lg active:scale-90 transition-all"><FiSend className="w-4 h-4" /></button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
