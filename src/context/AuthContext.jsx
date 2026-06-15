import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email) => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setUser({ id: 1, name: 'Sarah Johnson', email, phone: '+1 (555) 123-4567', avatar: 'https://i.pravatar.cc/80?u=user1', joinDate: '2025-01-15', tier: 'Gold' })
    setIsLoading(false)
  }, [])

  const register = useCallback(async (data) => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setUser({ id: Date.now(), name: data.name, email: data.email, phone: '', avatar: '', joinDate: new Date().toISOString().split('T')[0], tier: 'Silver' })
    setIsLoading(false)
  }, [])

  const logout = useCallback(() => setUser(null), [])
  const updateProfile = useCallback((data) => setUser(prev => ({ ...prev, ...data })), [])

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile, isAuthenticated: !!user }}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
