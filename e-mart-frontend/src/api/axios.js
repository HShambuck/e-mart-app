import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Request interceptor — get token via storage helper (stored as JSON)
api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem('token')
      const token = raw ? JSON.parse(raw) : null
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch {
      // ignore parse errors
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred'
    const status = error.response?.status

    if (status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        toast.error(message)
        window.location.href = '/login'
      }
    } else if (status === 403) {
      toast.error(message || 'You do not have permission')
    } else if (status === 429) {
      toast.error('Too many requests. Please slow down.')
    } else if (status === 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Network error. Please check your connection.')
    }

    return Promise.reject(error)
  }
)

export default api