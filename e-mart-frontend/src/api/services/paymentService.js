import api from '../axios'
import ENDPOINTS from '../endpoints'

const paymentService = {
  initialize: async (data) => {
    const res = await api.post(ENDPOINTS.PAYMENTS.INITIALIZE, data)
    return res.data
  },
  verify: async (reference) => {
    const res = await api.post(ENDPOINTS.PAYMENTS.VERIFY, { reference })
    return res.data
  },
  getHistory: async (params = {}) => {
    const res = await api.get(ENDPOINTS.PAYMENTS.HISTORY, { params })
    return res.data
  },
  getByOrder: async (orderId) => {
    const res = await api.get(ENDPOINTS.PAYMENTS.BY_ORDER(orderId))
    return res.data
  },
}

export default paymentService