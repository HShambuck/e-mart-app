import api from '../axios'
import ENDPOINTS from '../endpoints'
import { storage } from '../../utils/helpers'

const authService = {
  register: async (data) => {
    const res = await api.post(ENDPOINTS.AUTH.REGISTER, data)
    return res.data
  },

  verifyOTP: async (data) => {
    const res = await api.post(ENDPOINTS.AUTH.VERIFY_OTP, data)
    if (res.data.token) {
      storage.set('token', res.data.token)
      storage.set('user', res.data.user)
    }
    return res.data
  },

  resendOTP: async (phone) => {
    const res = await api.post(ENDPOINTS.AUTH.RESEND_OTP, { phone })
    return res.data
  },

  login: async (credentials) => {
    const res = await api.post(ENDPOINTS.AUTH.LOGIN, credentials)
    if (res.data.token) {
      storage.set('token', res.data.token)
      storage.set('user', res.data.user)
    }
    return res.data
  },

  getMe: async () => {
    const res = await api.get(ENDPOINTS.AUTH.ME)
    return res.data
  },

  logout: async () => {
    try { await api.post(ENDPOINTS.AUTH.LOGOUT) } catch {}
    storage.remove('token')
    storage.remove('user')
  },
}

export default authService