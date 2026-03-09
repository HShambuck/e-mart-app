const Notification = require('../models/Notification')
const { asyncHandler, AppError } = require('../utils/errorHandler')

// @route GET /api/notifications
exports.getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query
  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit),
    Notification.countDocuments({ user: req.user._id, isRead: false }),
  ])
  res.json({ success: true, notifications, unreadCount })
})

// @route PUT /api/notifications/:id/read
exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true, readAt: new Date() },
    { new: true }
  )
  if (!notification) throw new AppError('Notification not found', 404)
  res.json({ success: true, notification })
})

// @route PUT /api/notifications/read-all
exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true, readAt: new Date() })
  res.json({ success: true, message: 'All notifications marked as read' })
})

// @route DELETE /api/notifications/:id
exports.deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  res.json({ success: true, message: 'Notification deleted' })
})