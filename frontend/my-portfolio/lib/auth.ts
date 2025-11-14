import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://berkay-portfolio.duckdns.org/api'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  username: string
  message: string
}

export interface ChangePasswordRequest {
  username: string
  newPassword: string
}

export interface ChangeUsernameRequest {
  oldUsername: string
  newUsername: string
}

export const authApi = {
  login: (credentials: LoginRequest) => 
    axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, credentials),
  
  changePassword: (data: ChangePasswordRequest) => 
    axios.post(`${API_BASE_URL}/auth/change-password`, data),
  
  changeUsername: (data: ChangeUsernameRequest) => 
    axios.post(`${API_BASE_URL}/auth/change-username`, data)
}

// Token management
export const tokenManager = {
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  },
  
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  },
  
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('username')
    }
  },
  
  setUsername: (username: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('username', username)
    }
  },
  
  getUsername: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('username')
    }
    return null
  },
  
  isAuthenticated: () => {
    return !!tokenManager.getToken()
  }
}

// Configure axios to include token in requests
axios.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle 401 responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenManager.removeToken()
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)
