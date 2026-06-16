import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi'
import { FaGoogle, FaFacebookF } from 'react-icons/fa6'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.error || 'Invalid email or password')
    }
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF4F8B] to-[#7C3AED] rounded-xl flex items-center justify-center"><span className="text-white font-bold text-lg">B</span></div>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl text-sm text-red-600 dark:text-red-400">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#FF4F8B] rounded-xl text-sm outline-none transition-colors" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-[#FF4F8B] rounded-xl text-sm outline-none transition-colors" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-[#FF4F8B] rounded" /><span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span></label>
              <Link to="/forgot-password" className="text-sm text-[#FF4F8B] hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-gradient-to-r from-[#FF4F8B] to-[#FF6B9D] text-white rounded-xl font-semibold hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-70">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-gray-900 px-4 text-gray-400">or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: FaGoogle, label: 'Google', color: 'text-[#DB4437] hover:bg-red-50 dark:hover:bg-red-900/20' },
              { icon: FaFacebookF, label: 'Facebook', color: 'text-[#1877F2] hover:bg-blue-50 dark:hover:bg-blue-900/20' },
            ].map(s => (
              <button key={s.label} onClick={() => alert('Social login coming soon!')} className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all active:scale-95 ${s.color}`}>
                <s.icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">Don't have an account? <Link to="/register" className="text-[#FF4F8B] font-semibold hover:underline">Create one</Link></p>
        </div>
      </div>
    </Layout>
  )
}
