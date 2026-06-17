import { useState, useCallback } from 'react'
import { AuthContext } from './authContext.js'

const USER_KEY = 'skan_user'

const loadUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadUser)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(({ name = 'Алексей А.', avatarSrc = null }) => {
    setIsLoading(true)

    return new Promise((resolve) => {
      setTimeout(() => {
        const u = { name, avatarSrc, usedCount: 34, totalCount: 100 }
        setUser(u)
        localStorage.setItem(USER_KEY, JSON.stringify(u))
        setIsLoading(false)
        resolve(u)
      }, 1200)
    })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(USER_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
