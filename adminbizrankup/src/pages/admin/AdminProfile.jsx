import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import ImageUpload from '../../components/admin/ImageUpload'
import { FiSave, FiUser, FiMail, FiPhone, FiLock, FiLoader } from 'react-icons/fi'
import * as api from '../../api/client'

export default function AdminProfile() {
  const { user, updateProfile } = useAdmin()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState(null)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      await updateProfile({ name: form.name, phone: form.phone, avatar: form.avatar })
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: err?.error || 'Failed to update profile' })
    }
    setSaving(false)
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordMessage(null)

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    setPasswordSaving(true)
    try {
      const token = localStorage.getItem('shajgoj_admin_auth')
        ? JSON.parse(localStorage.getItem('shajgoj_admin_auth')).token
        : null
      const res = await fetch(`/api/users/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw data
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err?.error || 'Failed to change password' })
    }
    setPasswordSaving(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h1>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Profile Info</h2>
        <form onSubmit={handleSave} className="space-y-5">
          <ImageUpload label="Profile Photo" value={form.avatar} onChange={url => setForm({...form, avatar: url})} />

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" value={form.email} disabled className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none text-gray-400 cursor-not-allowed" />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone</label>
            <div className="relative">
              <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#FF4F8B] text-white text-sm font-semibold rounded-xl hover:bg-[#e64579] active:scale-95 transition-all disabled:opacity-50">
              {saving ? <><FiLoader className="w-4 h-4 animate-spin" /> Saving...</> : <><FiSave className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 md:p-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Change Password</h2>
        {passwordMessage && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${
            passwordMessage.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
          }`}>
            {passwordMessage.text}
          </div>
        )}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Current Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} required className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} required className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Confirm New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} required className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-[#FF4F8B] transition-colors" />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={passwordSaving} className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all disabled:opacity-50">
              {passwordSaving ? <><FiLoader className="w-4 h-4 animate-spin" /> Changing...</> : <><FiLock className="w-4 h-4" /> Change Password</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
