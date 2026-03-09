import api from '../axios'
import ENDPOINTS from '../endpoints'

const adminService = {
  getDashboard: async () => {
    const res = await api.get(ENDPOINTS.ADMIN.DASHBOARD)
    return res.data
  },
  getUsers: async (params = {}) => {
    const res = await api.get(ENDPOINTS.ADMIN.USERS, { params })
    return res.data
  },
  getUser: async (id) => {
    const res = await api.get(ENDPOINTS.ADMIN.USER(id))
    return res.data
  },
  toggleUserActive: async (id) => {
    const res = await api.put(ENDPOINTS.ADMIN.TOGGLE_USER(id))
    return res.data
  },
  getProducts: async (params = {}) => {
    const res = await api.get(ENDPOINTS.ADMIN.PRODUCTS, { params })
    return res.data
  },
  toggleFeatureProduct: async (id) => {
    const res = await api.put(ENDPOINTS.ADMIN.FEATURE_PRODUCT(id))
    return res.data
  },
  getOrders: async (params = {}) => {
    const res = await api.get(ENDPOINTS.ADMIN.ORDERS, { params })
    return res.data
  },
  getTransactions: async (params = {}) => {
    const res = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS, { params })
    return res.data
  },
  getVerifications: async (params = {}) => {
    const res = await api.get(ENDPOINTS.ADMIN.VERIFICATIONS, { params })
    return res.data
  },
  reviewVerification: async (id, data) => {
    const res = await api.put(ENDPOINTS.ADMIN.REVIEW_VERIFICATION(id), data)
    return res.data
  },
  getDisputes: async (params = {}) => {
    const res = await api.get(ENDPOINTS.ADMIN.DISPUTES, { params })
    return res.data
  },
  resolveDispute: async (id, data) => {
    const res = await api.put(ENDPOINTS.ADMIN.RESOLVE_DISPUTE(id), data)
    return res.data
  },
  broadcast: async (data) => {
    const res = await api.post(ENDPOINTS.ADMIN.BROADCAST, data)
    return res.data
  },
}

export default adminService