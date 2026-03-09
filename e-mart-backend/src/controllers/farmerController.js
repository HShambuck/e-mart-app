const User = require('../models/User')
const Farmer = require('../models/Farmer')
const Order = require('../models/Order')
const Product = require('../models/Product')
const Notification = require('../models/Notification')

const getDashboard = async (req, res) => {
  try {
    const id = req.user._id
    const [totalProducts, activeOrders, farmerProfile, recentOrders, earningsAgg, monthlyAgg] = await Promise.all([
      Product.countDocuments({ farmer: id }),
      Order.countDocuments({ farmer: id, status: { $in: ['pending', 'accepted', 'payment_confirmed', 'ready_for_collection'] } }),
      Farmer.findOne({ user: id }),
      Order.find({ farmer: id }).sort({ createdAt: -1 }).limit(5)
        .populate('product', 'name variety images')
        .populate('buyer', 'name phone'),
      Order.aggregate([
        { $match: { farmer: id, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$farmerAmount' }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { farmer: id, status: 'completed', completedAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } },
        { $group: { _id: null, total: { $sum: '$farmerAmount' } } },
      ]),
    ])
    res.json({
      success: true,
      stats: {
        totalProducts,
        activeOrders,
        totalEarnings: earningsAgg[0]?.total || 0,
        completedOrders: earningsAgg[0]?.count || 0,
        monthlyEarnings: monthlyAgg[0]?.total || 0,
        rating: farmerProfile?.rating || 0,
      },
      recentOrders,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ user: req.user._id })
    res.json({ success: true, user: req.user, farmer })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, email, avatar, farmName, region, district, farmSize, cooperative, riceVarieties, bio, bankDetails } = req.body
    const userUpdate = {}
    if (name) userUpdate.name = name
    if (email) userUpdate.email = email
    if (avatar) userUpdate.avatar = avatar

    await User.findByIdAndUpdate(req.user._id, userUpdate)
    const farmer = await Farmer.findOneAndUpdate(
      { user: req.user._id },
      { farmName, region, district, farmSize, cooperative, riceVarieties, bio, bankDetails },
      { new: true, upsert: true }
    )
    const user = await User.findById(req.user._id)
    res.json({ success: true, message: 'Profile updated', user, farmer })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const query = { farmer: req.user._id }
    if (status) query.status = status
    const [orders, total] = await Promise.all([
      Order.find(query).populate('product', 'name variety images').populate('buyer', 'name phone avatar')
        .sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit),
      Order.countDocuments(query),
    ])
    res.json({ success: true, orders, total, pages: Math.ceil(total / limit), page: Number(page) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, farmer: req.user._id })
      .populate('product').populate('buyer', 'name phone email avatar')
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
    res.json({ success: true, order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body
    const order = await Order.findOne({ _id: req.params.id, farmer: req.user._id })
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })

    const allowed = {
      pending: ['accepted', 'rejected'],
      accepted: ['ready_for_collection', 'cancelled'],
      payment_confirmed: ['ready_for_collection'],
      ready_for_collection: ['completed'],
    }
    if (!allowed[order.status]?.includes(status))
      return res.status(400).json({ success: false, message: `Cannot change from ${order.status} to ${status}` })

    order.status = status
    order.statusHistory.push({ status, note: note || '' })
    if (status === 'completed') {
      order.completedAt = new Date()
      await Farmer.findOneAndUpdate({ user: req.user._id }, { $inc: { completedOrders: 1, totalEarnings: order.farmerAmount } })
    }
    await order.save()

    // Notify buyer
    await Notification.create({
      user: order.buyer,
      title: 'Order Update',
      message: `Your order #${order.orderNumber} has been ${status.replace(/_/g, ' ')}`,
      type: 'order',
      link: `/buyer/orders/${order._id}`,
    })

    res.json({ success: true, message: 'Order updated', order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getSales = async (req, res) => {
  try {
    const id = req.user._id
    const sales = await Order.aggregate([
      { $match: { farmer: id, status: 'completed' } },
      { $group: { _id: { month: { $month: '$completedAt' }, year: { $year: '$completedAt' } }, revenue: { $sum: '$farmerAmount' }, orders: { $sum: 1 }, bags: { $sum: '$quantity' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ])
    const totalRevenue = sales.reduce((s, i) => s + i.revenue, 0)
    const totalOrders = sales.reduce((s, i) => s + i.orders, 0)
    res.json({ success: true, sales, totalRevenue, totalOrders })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getDashboard, getProfile, updateProfile, getOrders, getOrder, updateOrderStatus, getSales }