import api from '../axios'
import ENDPOINTS from '../endpoints'

const buyerService = {
  getDashboard: async () => {
    const res = await api.get(ENDPOINTS.BUYER.DASHBOARD)
    return res.data
  },
  getProfile: async () => {
    const res = await api.get(ENDPOINTS.BUYER.PROFILE)
    return res.data
  },
  updateProfile: async (data) => {
    const res = await api.put(ENDPOINTS.BUYER.PROFILE, data)
    return res.data
  },
}

export default buyerService