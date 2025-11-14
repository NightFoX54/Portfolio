'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { tokenManager, authApi, LoginRequest } from '@/lib/auth'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = tokenManager.getToken()
      setIsAuthenticated(!!token)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials)
      tokenManager.setToken(response.data.token)
      tokenManager.setUsername(response.data.username)
      setIsAuthenticated(true)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    tokenManager.removeToken()
    setIsAuthenticated(false)
    router.push('/admin/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
