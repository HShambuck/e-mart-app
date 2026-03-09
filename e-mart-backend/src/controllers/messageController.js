const Message = require('../models/Message')
const User = require('../models/User')
const { asyncHandler, AppError } = require('../utils/errorHandler')
const { emitToUser } = require('../config/socket')
const { notifyNewMessage } = require('../services/notificationService')

// @route GET /api/messages/conversations
exports.getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id

  const conversations = await Message.aggregate([
    { $match: { $or: [{ sender: userId }, { receiver: userId }] } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: { $cond: [{ $eq: ['$sender', userId] }, '$receiver', '$sender'] },
        lastMessage: { $first: '$message' },
        lastTime: { $first: '$createdAt' },
        unreadCount: {
          $sum: { $cond: [{ $and: [{ $eq: ['$receiver', userId] }, { $eq: ['$isRead', false] }] }, 1, 0] },
        },
      },
    },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $sort: { lastTime: -1 } },
    {
      $project: {
        _id: '$user._id',
        name: '$user.name',
        avatar: '$user.avatar',
        role: '$user.role',
        lastMessage: 1,
        lastTime: 1,
        unreadCount: 1,
      },
    },
  ])

  res.json({ success: true, conversations })
})

// @route GET /api/messages/:userId
exports.getMessages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query
  const otherUserId = req.params.userId

  const otherUser = await User.findById(otherUserId, 'name avatar role')
  if (!otherUser) throw new AppError('User not found', 404)

  const [messages, total] = await Promise.all([
    Message.find({
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id },
      ],
    })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit),
    Message.countDocuments({
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id },
      ],
    }),
  ])

  // Mark incoming messages as read
  await Message.updateMany(
    { sender: otherUserId, receiver: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  )

  res.json({ success: true, messages: messages.reverse(), total, otherUser })
})

// @route POST /api/messages
exports.sendMessage = asyncHandler(async (req, res) => {
  const { receiver, message, orderId } = req.body

  if (receiver === req.user._id.toString()) throw new AppError('Cannot message yourself', 400)

  const receiverUser = await User.findById(receiver)
  if (!receiverUser) throw new AppError('Recipient not found', 404)

  const newMessage = await Message.create({
    sender: req.user._id,
    receiver,
    message,
    order: orderId || null,
  })

  await newMessage.populate('sender', 'name avatar')

  // Real-time delivery
  emitToUser(receiver, 'new_message', newMessage)

  // Notify if receiver is offline
  await notifyNewMessage(receiver, req.user.name)

  res.status(201).json({ success: true, message: newMessage })
})

// @route PUT /api/messages/:userId/read
exports.markAsRead = asyncHandler(async (req, res) => {
  await Message.updateMany(
    { sender: req.params.userId, receiver: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  )
  res.json({ success: true })
})

// @route GET /api/messages/unread/count
exports.getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Message.countDocuments({ receiver: req.user._id, isRead: false })
  res.json({ success: true, count })
})