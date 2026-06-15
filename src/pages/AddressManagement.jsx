import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import { FiMapPin, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'

export default function AddressManagement() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [addresses] = useState([
    { id: 1, label: 'Home', street: '123 Beauty Avenue', city: 'New York', state: 'NY', zip: '10001', default: true },
    { id: 2, label: 'Office', street: '456 Business Blvd', city: 'New York', state: 'NY', zip: '10002', default: false },
  ])

  if (!user) { navigate('/login'); return null }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Addresses</h1>
            <p className="text-sm text-gray-500 mt-1">{addresses.length} saved addresses</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white rounded-xl text-sm font-semibold hover:shadow-lg active:scale-95 transition-all">
            <FiPlus className="w-4 h-4" /> Add New
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <div key={addr.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FiMapPin className="w-4 h-4 text-[#FF4F8B]" />
                  <span className="font-semibold text-gray-900 dark:text-white">{addr.label}</span>
                  {addr.default && <span className="text-[10px] font-medium text-[#FF4F8B] bg-pink-50 dark:bg-pink-900/20 px-2 py-0.5 rounded-lg">Default</span>}
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"><FiEdit2 className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500"><FiTrash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{addr.street}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{addr.city}, {addr.state} {addr.zip}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
