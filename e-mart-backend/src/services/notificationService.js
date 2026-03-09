const Notification = require('../models/Notification')
const { emitToUser } = require('../config/socket')
const logger = require('../utils/logger')

const createNotification = async ({ userId, title, message, type = 'system', link = null, data = null }) => {
  try {
    const notification = await Notification.create({ user: userId, title, message, type, link, data })
    emitToUser(userId.toString(), 'new_notification', notification)
    return notification
  } catch (err) {
    logger.error('Failed to create notification:', err.message)
  }
}

const notifyOrderPlaced = (farmerId, order, product) => createNotification({ userId: farmerId, title: 'New Order Received 🎉', message: `New order: ${order.quantity} bags of ${product.name}`, type: 'order', link: `/farmer/orders/${order._id}`, data: { orderId: order._id } })
const notifyOrderAccepted = (buyerId, order) => createNotification({ userId: buyerId, title: 'Order Accepted ✅', message: `Order #${order.orderNumber} accepted`, type: 'order', link: `/buyer/orders/${order._id}` })
const notifyOrderStatusChanged = (userId, order, message) => createNotification({ userId, title: 'Order Update', message, type: 'order', link: `/buyer/orders/${order._id}` })
const notifyPaymentReceived = (farmerId, order) => createNotification({ userId: farmerId, title: 'Payment Received 💰', message: `Payment confirmed for order #${order.orderNumber}`, type: 'payment' })
const notifyNewMessage = (receiverId, senderName) => createNotification({ userId: receiverId, title: 'New Message 💬', message: `${senderName} sent you a message`, type: 'message', link: '/messages' })

module.exports = { createNotification, notifyOrderPlaced, notifyOrderAccepted, notifyOrderStatusChanged, notifyPaymentReceived, notifyNewMessage }