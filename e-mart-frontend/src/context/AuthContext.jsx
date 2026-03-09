import { createContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'
import ENDPOINTS from '../api/endpoints'
import { storage } from '../utils/helpers'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(storage.get('token'))
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = storage.get('token')
      const storedUser = storage.get('user')

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(storedUser)
        setIsAuthenticated(true)

        try {
          const response = await api.get(ENDPOINTS.AUTH.ME)
          setUser(response.data.user)
          storage.set('user', response.data.user)
        } catch {
          logout()
        }
      }

      setLoading(false)
    }

    initializeAuth()
  }, [])

  // ✅ Simple register — gets token back directly, goes straight to dashboard
  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData)
      const { token: authToken, user: userData2, message } = response.data

      storage.set('token', authToken)
      storage.set('user', userData2)
      setToken(authToken)
      setUser(userData2)
      setIsAuthenticated(true)

      toast.success(message || 'Account created successfully!')
      navigateByRole(userData2.role)

      return { success: true, data: response.data }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials)
      const { token: authToken, user: userData, message } = response.data

      storage.set('token', authToken)
      storage.set('user', userData)
      setToken(authToken)
      setUser(userData)
      setIsAuthenticated(true)

      toast.success(message || 'Login successful!')
      navigateByRole(userData.role)

      return { success: true, data: response.data }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const logout = useCallback(async () => {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT)
    } catch {
      // continue regardless
    }

    storage.remove('token')
    storage.remove('user')
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)

    toast.success('Logged out successfully')
    navigate('/login')
  }, [navigate])

  const navigateByRole = (role) => {
    switch (role) {
      case 'farmer': navigate('/farmer/dashboard'); break
      case 'buyer':  navigate('/buyer/dashboard');  break
      case 'admin':  navigate('/admin/dashboard');  break
      default:       navigate('/')
    }
  }

  const hasRole  = (role) => user?.role === role
  const isVerified = () => user?.isVerified === true

  // Stubs so nothing breaks
  const verifyOTP  = async () => ({ success: true })
  const resendOTP  = async () => ({ success: true })
  const updateProfile = async () => ({ success: true })

  const value = {
    user, token, loading, isAuthenticated,
    register, login, logout,
    verifyOTP, resendOTP, updateProfile,
    hasRole, isVerified, navigateByRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}