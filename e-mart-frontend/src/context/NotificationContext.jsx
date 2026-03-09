import { createContext, useState, useEffect, useCallback, useContext } from 'react'
import { io } from 'socket.io-client'
import toast from 'react-hot-toast'
import api from '../api/axios'
import ENDPOINTS from '../api/endpoints'
import { AuthContext } from './AuthContext'

export const NotificationContext = createContext(null)

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export const NotificationProvider = ({ children }) => {
  const { token, isAuthenticated } = useContext(AuthContext)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [socket, setSocket] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !token) return
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    })
    newSocket.on('connect', () => console.log('Socket connected'))
    newSocket.on('disconnect', () => console.log('Socket disconnected'))
    newSocket.on('new_notification', handleNewNotification)
    newSocket.on('error', (err) => console.error('Socket error:', err))
    setSocket(newSocket)
    return () => newSocket.close()
  }, [isAuthenticated, token])

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      setLoading(true)
      const res = await api.get(ENDPOINTS.NOTIFICATIONS.BASE)
      setNotifications(res.data.notifications || [])
      setUnreadCount(res.data.unreadCount || 0)
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) fetchNotifications()
    else { setNotifications([]); setUnreadCount(0) }
  }, [isAuthenticated, fetchNotifications])

  const handleNewNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev])
    setUnreadCount((prev) => prev + 1)
    const icons = { order: '📦', payment: '💰', message: '💬', verification: '✅', system: '🔔', promotion: '🎁' }
    toast(notification.message, { icon: icons[notification.type] || '🔔', duration: 5000 })
  }

  const markAsRead = async (id) => {
    try {
      await api.put(ENDPOINTS.NOTIFICATIONS.MARK_READ(id))
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) { console.error(err) }
  }

  const markAllAsRead = async () => {
    try {
      await api.put(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ)
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (err) { console.error(err) }
  }

  const deleteNotification = async (id) => {
    try {
      await api.delete(ENDPOINTS.NOTIFICATIONS.DELETE(id))
      const notif = notifications.find((n) => n._id === id)
      setNotifications((prev) => prev.filter((n) => n._id !== id))
      if (!notif?.isRead) setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) { console.error(err) }
  }

  const emit = (event, data) => { if (socket?.connected) socket.emit(event, data) }

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount, loading, socket,
      fetchNotifications, markAsRead, markAllAsRead, deleteNotification, emit,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}