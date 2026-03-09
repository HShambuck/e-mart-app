import api from '../axios'
import ENDPOINTS from '../endpoints'

const messageService = {
  getConversations: async () => {
    const res = await api.get(ENDPOINTS.MESSAGES.CONVERSATIONS)
    return res.data
  },
  getMessages: async (userId, params = {}) => {
    const res = await api.get(ENDPOINTS.MESSAGES.BY_USER(userId), { params })
    return res.data
  },
  sendMessage: async (data) => {
    const res = await api.post(ENDPOINTS.MESSAGES.SEND, data)
    return res.data
  },
  markAsRead: async (userId) => {
    const res = await api.put(ENDPOINTS.MESSAGES.MARK_READ(userId))
    return res.data
  },
  getUnreadCount: async () => {
    const res = await api.get(ENDPOINTS.MESSAGES.UNREAD_COUNT)
    return res.data
  },
}

export default messageService