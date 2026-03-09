import api from '../axios'
import ENDPOINTS from '../endpoints'

const farmerService = {
  getDashboard: async () => {
    const res = await api.get(ENDPOINTS.FARMER.DASHBOARD)
    return res.data
  },
  getProfile: async () => {
    const res = await api.get(ENDPOINTS.FARMER.PROFILE)
    return res.data
  },
  updateProfile: async (data) => {
    const res = await api.put(ENDPOINTS.FARMER.PROFILE, data)
    return res.data
  },
  getOrders: async (params = {}) => {
    const res = await api.get(ENDPOINTS.FARMER.ORDERS, { params })
    return res.data
  },
  getOrder: async (id) => {
    const res = await api.get(ENDPOINTS.FARMER.ORDER(id))
    return res.data
  },
  updateOrderStatus: async (id, data) => {
    const res = await api.put(ENDPOINTS.FARMER.ORDER_STATUS(id), data)
    return res.data
  },
  getSales: async () => {
    const res = await api.get(ENDPOINTS.FARMER.SALES)
    return res.data
  },
}

export default farmerService