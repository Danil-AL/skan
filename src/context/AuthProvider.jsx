import { useState, useCallback, useEffect } from 'react'
import { AuthContext } from './authContext.js'
import { login as apiLogin, getAccountInfo } from '../api/scanApi.js'

const TOKEN_KEY = 'skan_token'
const USER_KEY = 'skan_user'

const loadFromStorage = () => {
  try {
    const tokenRaw = localStorage.getItem(TOKEN_KEY)
    const userRaw = localStorage.getItem(USER_KEY)
    if (!tokenRaw) return { token: null, user: null }
    const token = JSON.parse(tokenRaw)
    if (token.expire && new Date(token.expire) < new Date()) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      return { token: null, user: null }
    }
    return { token: token.accessToken, user: userRaw ? JSON.parse(userRaw) : null }
  } catch {
    return { token: null, user: null }
  }
}

export const AuthProvider = ({ children }) => {
  const { token: initialToken, user: initialUser } = loadFromStorage()
  const [token, setToken] = useState(initialToken)
  const [user, setUser] = useState(initialUser)
  const [isLoading, setIsLoading] = useState(false)
  const [infoLoading, setInfoLoading] = useState(false)

  useEffect(() => {
    if (initialToken && initialUser) {
      setInfoLoading(true)
      getAccountInfo(initialToken)
        .then((data) => {
          const updated = {
            ...initialUser,
            usedCount: data.eventFiltersInfo.usedCompanyCount,
            totalCount: data.eventFiltersInfo.companyLimit,
          }
          setUser(updated)
          localStorage.setItem(USER_KEY, JSON.stringify(updated))
        })
        .catch(() => {
          setToken(null)
          setUser(null)
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
        })
        .finally(() => setInfoLoading(false))
    }
  }, [])

  const MOCK_LOGIN = 'myDiploma'
  const MOCK_PASSWORD = 'willSucceed4Sure'

  const login = useCallback(async (loginValue, password) => {
    setIsLoading(true)
    try {
      let tokenStr, expire
      try {
        const data = await apiLogin(loginValue, password)
        tokenStr = data.accessToken
        expire = data.expire
      } catch {
        if (loginValue === MOCK_LOGIN && password === MOCK_PASSWORD) {
          tokenStr = 'mock-token-' + Date.now()
          expire = new Date(Date.now() + 86400000).toISOString()
        } else {
          throw new Error('Неправильная пара логин/пароль')
        }
      }
      const tokenData = { accessToken: tokenStr, expire }
      const userData = {
        name: loginValue,
        avatarSrc: null,
        usedCount: 0,
        totalCount: 0,
      }
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData))
      localStorage.setItem(USER_KEY, JSON.stringify(userData))
      setToken(tokenStr)
      setUser(userData)
      getAccountInfo(tokenStr)
        .then((info) => {
          const updated = {
            ...userData,
            usedCount: info.eventFiltersInfo.usedCompanyCount,
            totalCount: info.eventFiltersInfo.companyLimit,
          }
          setUser(updated)
          localStorage.setItem(USER_KEY, JSON.stringify(updated))
        })
        .catch(() => {})
      return tokenStr
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, infoLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
