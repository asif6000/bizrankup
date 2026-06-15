import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => { e.preventDefault(); if (email) setSent(true) }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF4F8B] to-[#7C3AED] rounded-xl flex items-center justify-center"><span className="text-white font-bold text-lg">B</span></div>
            </Link>
            {sent ? (
              <>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"><FiCheckCircle className="w-8 h-8 text-green-600" /></div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Check Your Email</h1>
                <p className="text-sm text-gray-500 mt-2">We've sent a password reset link to <strong>{email}</strong></p>
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-[#FF4F8B] font-medium mt-6 hover:underline"><FiArrowLeft className="w-4 h-4" />Back to Sign In</Link>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h1>
                <p className="text-sm text-gray-500 mt-1">Enter your email and we'll send you a reset link</p>
              </>
            )}
          </div>

          {!sent && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#FF4F8B] rounded-xl text-sm outline-none transition-colors" placeholder="you@example.com" />
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white rounded-xl font-semibold hover:shadow-lg active:scale-[0.98] transition-all">Send Reset Link</button>
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#FF4F8B] transition-colors"><FiArrowLeft className="w-4 h-4" />Back to Sign In</Link>
            </form>
          )}
        </div>
      </div>
    </Layout>
  )
}
