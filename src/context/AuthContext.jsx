import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as api from '../api/client'

const STORAGE_KEY = 'shajgoj_auth'
const AuthContext = createContext()

function loadAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const saved = loadAuth()
    const init = saved?.token
      ? api.auth.me()
          .then(userData => setUser({ ...saved.user, ...userData }))
          .catch(() => { localStorage.removeItem(STORAGE_KEY); setUser(null) })
      : Promise.resolve()
    init.finally(() => setAuthLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    if (!email || !password) throw new Error('Email and password are required')
    setIsLoading(true)
    try {
      const res = await api.auth.login(email, password)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: res.token, user: res.user }))
      setUser(res.user)
      return res
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (data) => {
    setIsLoading(true)
    try {
      const res = await api.auth.register(data)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: res.token, user: res.user }))
      setUser(res.user)
      return res
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (data) => {
    setUser(prev => ({ ...prev, ...data }))
    try {
      const body = {}
      if (data.name !== undefined) body.name = data.name
      if (data.phone !== undefined) body.phone = data.phone
      if (data.avatar !== undefined) body.avatar = data.avatar
      await api.users.update(user.id, body)
    } catch { /* local update only */ }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, isLoading, authLoading, login, register, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
