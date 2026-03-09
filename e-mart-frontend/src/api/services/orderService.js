import api from '../axios'
import ENDPOINTS from '../endpoints'

const orderService = {
  placeOrder: async (data) => {
    const res = await api.post(ENDPOINTS.ORDERS.BASE, data)
    return res.data
  },
  getMyOrders: async (params = {}) => {
    const res = await api.get(ENDPOINTS.ORDERS.MY, { params })
    return res.data
  },
  getOrder: async (id) => {
    const res = await api.get(ENDPOINTS.ORDERS.BY_ID(id))
    return res.data
  },
  cancelOrder: async (id, reason) => {
    const res = await api.put(ENDPOINTS.ORDERS.CANCEL(id), { reason })
    return res.data
  },
  addReview: async (id, data) => {
    const res = await api.post(ENDPOINTS.ORDERS.REVIEW(id), data)
    return res.data
  },
}

export default orderService