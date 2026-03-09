const User = require('../models/User')
const Farmer = require('../models/Farmer')
const Buyer = require('../models/Buyer')
const Product = require('../models/Product')
const Order = require('../models/Order')
const Transaction = require('../models/Transaction')
const Dispute = require('../models/Dispute')
const Verification = require('../models/Verification')
const { asyncHandler, AppError } = require('../utils/errorHandler')
const { getPlatformStats, getMonthlyRevenue } = require('../services/analyticsService')
const { createNotification } = require('../services/notificationService')

// @route GET /api/admin/dashboard
exports.getDashboard = asyncHandler(async (req, res) => {
  const [stats, monthly, recentOrders, pendingVerifications, openDisputes] = await Promise.all([
    getPlatformStats(),
    getMonthlyRevenue(),
    Order.find().sort({ createdAt: -1 }).limit(10)
      .populate('buyer', 'name phone').populate('farmer', 'name phone').populate('product', 'name'),
    Verification.countDocuments({ status: 'pending' }),
    Dispute.countDocuments({ status: 'open' }),
  ])

  res.json({ success: true, stats: { ...stats, pendingVerifications, openDisputes }, monthly, recentOrders })
})

// @route GET /api/admin/users
exports.getUsers = asyncHandler(async (req, res) => {
  const { role, isVerified, isActive, search, page = 1, limit = 20 } = req.query
  const query = {}
  if (role) query.role = role
  if (isVerified !== undefined) query.isVerified = isVerified === 'true'
  if (isActive !== undefined) query.isActive = isActive === 'true'
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { phone: { $regex: search, $options: 'i' } }]

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit),
    User.countDocuments(query),
  ])
  res.json({ success: true, users, total, pages: Math.ceil(total / limit) })
})

// @route GET /api/admin/users/:id
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) throw new AppError('User not found', 404)
  let profile = null
  if (user.role === 'farmer') profile = await Farmer.findOne({ user: user._id })
  if (user.role === 'buyer') profile = await Buyer.findOne({ user: user._id })
  res.json({ success: true, user, profile })
})

// @route PUT /api/admin/users/:id/toggle-active
exports.toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) throw new AppError('User not found', 404)
  user.isActive = !user.isActive
  await user.save()
  res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive })
})

// @route GET /api/admin/products
exports.getProducts = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query
  const query = {}
  if (status) query.status = status
  const [products, total] = await Promise.all([
    Product.find(query).populate('farmer', 'name phone').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit),
    Product.countDocuments(query),
  ])
  res.json({ success: true, products, total, pages: Math.ceil(total / limit) })
})

// @route PUT /api/admin/products/:id/feature
exports.toggleFeatureProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) throw new AppError('Product not found', 404)
  product.isFeatured = !product.isFeatured
  await product.save()
  res.json({ success: true, isFeatured: product.isFeatured })
})

// @route GET /api/admin/orders
exports.getOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query
  const query = {}
  if (status) query.status = status
  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('buyer', 'name phone').populate('farmer', 'name phone').populate('product', 'name variety')
      .sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit),
    Order.countDocuments(query),
  ])
  res.json({ success: true, orders, total, pages: Math.ceil(total / limit) })
})

// @route GET /api/admin/transactions
exports.getTransactions = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query
  const query = {}
  if (status) query.status = status
  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .populate('buyer', 'name phone').populate('farmer', 'name phone').populate('order', 'orderNumber')
      .sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit),
    Transaction.countDocuments(query),
  ])
  res.json({ success: true, transactions, total, pages: Math.ceil(total / limit) })
})

// @route GET /api/admin/verifications
exports.getVerifications = asyncHandler(async (req, res) => {
  const { status = 'pending', page = 1, limit = 20 } = req.query
  const [verifications, total] = await Promise.all([
    Verification.find({ status }).populate('user', 'name phone role avatar')
      .sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit),
    Verification.countDocuments({ status }),
  ])
  res.json({ success: true, verifications, total, pages: Math.ceil(total / limit) })
})

// @route PUT /api/admin/verifications/:id
exports.reviewVerification = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body
  if (!['approved', 'rejected'].includes(status)) throw new AppError('Invalid status', 400)

  const verification = await Verification.findById(req.params.id).populate('user', 'name role')
  if (!verification) throw new AppError('Verification not found', 404)

  verification.status = status
  verification.adminNotes = adminNotes
  verification.reviewedBy = req.user._id
  verification.reviewedAt = new Date()
  await verification.save()

  if (status === 'approved') {
    if (verification.user.role === 'farmer') {
      await Farmer.findOneAndUpdate({ user: verification.user._id }, { isVerified: true, verificationBadge: 'basic' })
    }
    await User.findByIdAndUpdate(verification.user._id, { isVerified: true })
  }

  await createNotification({
    userId: verification.user._id,
    title: status === 'approved' ? 'Verification Approved ✅' : 'Verification Rejected ❌',
    message: status === 'approved'
      ? 'Your verification has been approved. Your badge is now active!'
      : `Your verification was rejected. ${adminNotes || ''}`,
    type: 'verification',
  })

  res.json({ success: true, message: `Verification ${status}`, verification })
})

// @route GET /api/admin/disputes
exports.getDisputes = asyncHandler(async (req, res) => {
  const { status = 'open', page = 1, limit = 20 } = req.query
  const [disputes, total] = await Promise.all([
    Dispute.find({ status })
      .populate('order', 'orderNumber totalAmount')
      .populate('raisedBy', 'name phone role')
      .populate('against', 'name phone role')
      .sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit),
    Dispute.countDocuments({ status }),
  ])
  res.json({ success: true, disputes, total, pages: Math.ceil(total / limit) })
})

// @route PUT /api/admin/disputes/:id/resolve
exports.resolveDispute = asyncHandler(async (req, res) => {
  const { resolution, adminNotes } = req.body
  const dispute = await Dispute.findById(req.params.id)
    .populate('raisedBy', 'name').populate('against', 'name')
  if (!dispute) throw new AppError('Dispute not found', 404)

  dispute.status = 'resolved'
  dispute.resolution = resolution
  dispute.adminNotes = adminNotes
  dispute.resolvedBy = req.user._id
  dispute.resolvedAt = new Date()
  await dispute.save()

  // Notify both parties
  await Promise.all([
    createNotification({ userId: dispute.raisedBy._id, title: 'Dispute Resolved', message: `Your dispute has been resolved: ${resolution}`, type: 'system' }),
    createNotification({ userId: dispute.against._id, title: 'Dispute Resolved', message: `A dispute against you has been resolved: ${resolution}`, type: 'system' }),
  ])

  res.json({ success: true, message: 'Dispute resolved', dispute })
})

// @route POST /api/admin/broadcast
exports.broadcastNotification = asyncHandler(async (req, res) => {
  const { title, message, role, type = 'system' } = req.body
  const query = { isActive: true }
  if (role) query.role = role

  const users = await User.find(query, '_id')
  const notifications = users.map(u => ({ user: u._id, title, message, type }))
  await require('../models/Notification').insertMany(notifications)

  res.json({ success: true, message: `Broadcast sent to ${notifications.length} users` })
})