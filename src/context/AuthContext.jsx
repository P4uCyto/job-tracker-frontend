import { createContext, useContext, useState } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('jt_user')
      return s ? JSON.parse(s) : null
    } catch { return null }
  })

  const login = async (email, password) => {
    const data = await api.auth.login({ email, password })
    localStorage.setItem('jt_token', data.token)
    localStorage.setItem('jt_user',  JSON.stringify(data.user))
    setUser(data.user)
    return data
  }

  const register = async (email, password, name) => {
    const data = await api.auth.register({ email, password, name })
    localStorage.setItem('jt_token', data.token)
    localStorage.setItem('jt_user',  JSON.stringify(data.user))
    setUser(data.user)
    return data
  }

  const logout = () => {
    localStorage.removeItem('jt_token')
    localStorage.removeItem('jt_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
