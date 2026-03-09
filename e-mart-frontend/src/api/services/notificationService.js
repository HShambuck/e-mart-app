import api from '../axios'
import ENDPOINTS from '../endpoints'

const notificationService = {
  getNotifications: async (params = {}) => {
    const res = await api.get(ENDPOINTS.NOTIFICATIONS.BASE, { params })
    return res.data
  },
  markAsRead: async (id) => {
    const res = await api.put(ENDPOINTS.NOTIFICATIONS.MARK_READ(id))
    return res.data
  },
  markAllAsRead: async () => {
    const res = await api.put(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ)
    return res.data
  },
  deleteNotification: async (id) => {
    const res = await api.delete(ENDPOINTS.NOTIFICATIONS.DELETE(id))
    return res.data
  },
}

export default notificationService