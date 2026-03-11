const Order = require('../models/Order')
const Product = require('../models/Product')
const Notification = require('../models/Notification')

const PLATFORM_FEE = 0.05

const placeOrder = async (req, res) => {
  try {
    const { product: productId, quantity, pickupLocation, pickupDate, notes } = req.body

    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    if (product.status !== 'available') return res.status(400).json({ success: false, message: 'Product not available' })
    if (product.quantity < quantity) return res.status(400).json({ success: false, message: `Only ${product.quantity} bags available` })
    if (product.farmer.toString() === req.user._id.toString()) return res.status(400).json({ success: false, message: 'Cannot order your own product' })

    const totalAmount = product.pricePerBag * quantity
    const platformFee = Math.round(totalAmount * PLATFORM_FEE * 100) / 100

    const order = await Order.create({
      buyer: req.user._id,
      farmer: product.farmer,
      product: productId,
      quantity,
      pricePerBag: product.pricePerBag,
      totalAmount,
      platformFee,
      farmerAmount: totalAmount - platformFee,
      pickupDetails: {
        location: pickupLocation,
        date: pickupDate || null,
        notes: notes || '',
      },
      statusHistory: [{ status: 'pending', note: 'Order placed' }],
    })

    await Notification.create({
      user: product.farmer,
      title: 'New Order!',
      message: `You received a new order for ${quantity} bag(s) of ${product.variety}`,
      type: 'order',
      link: `/farmer/orders/${order._id}`,
    })

    const populated = await order.populate([
      { path: 'product', select: 'variety images bagSize' },
      { path: 'buyer', select: 'name phone' },
    ])

    res.status(201).json({ success: true, message: 'Order placed successfully', order: populated })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getMyOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const query = { buyer: req.user._id }
    if (status) query.status = status
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('product', 'variety images bagSize')
        .populate('farmer', 'name phone avatar')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit),
      Order.countDocuments(query),
    ])
    res.json({ success: true, orders, total, pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product', 'variety images bagSize qualityDescription')
      .populate('buyer', 'name phone email avatar')
      .populate('farmer', 'name phone email avatar')
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
    const isOwner = order.buyer._id.equals(req.user._id) || order.farmer._id.equals(req.user._id) || req.user.role === 'admin'
    if (!isOwner) return res.status(403).json({ success: false, message: 'Not authorized' })
    res.json({ success: true, order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
    const isOwner = order.buyer.equals(req.user._id) || order.farmer.equals(req.user._id)
    if (!isOwner) return res.status(403).json({ success: false, message: 'Not authorized' })
    if (!['pending', 'accepted'].includes(order.status))
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' })

    const cancelledBy = order.buyer.equals(req.user._id) ? 'buyer' : 'farmer'
    order.status = 'cancelled'
    order.cancelReason = reason
    order.cancelledBy = cancelledBy
    order.statusHistory.push({ status: 'cancelled', note: reason })
    await order.save()

    const notifyUser = cancelledBy === 'buyer' ? order.farmer : order.buyer
    await Notification.create({
      user: notifyUser,
      title: 'Order Cancelled',
      message: `Order #${order.orderNumber} has been cancelled. Reason: ${reason}`,
      type: 'order',
      link: `/${cancelledBy === 'buyer' ? 'farmer' : 'buyer'}/orders/${order._id}`,
    })

    res.json({ success: true, message: 'Order cancelled', order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body
    const order = await Order.findOne({ _id: req.params.id, buyer: req.user._id, status: 'completed' })
    if (!order) return res.status(404).json({ success: false, message: 'Completed order not found' })
    if (order.review?.rating) return res.status(400).json({ success: false, message: 'Already reviewed' })

    order.review = { rating, comment, createdAt: new Date() }
    await order.save()

    const orders = await Order.find({ product: order.product, 'review.rating': { $exists: true } })
    const avg = orders.reduce((s, o) => s + o.review.rating, 0) / orders.length
    await Product.findByIdAndUpdate(order.product, { rating: +avg.toFixed(1), totalReviews: orders.length })

    res.json({ success: true, message: 'Review submitted', order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// Farmer updates order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body
    const order = await Order.findOne({ _id: req.params.id, farmer: req.user._id })
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })

    const validTransitions = {
      pending: ['accepted', 'cancelled'],
      accepted: ['payment_pending', 'cancelled'],
      payment_confirmed: ['ready_for_collection'],
      ready_for_collection: ['completed'],
    }

    if (!validTransitions[order.status]?.includes(status))
      return res.status(400).json({ success: false, message: `Cannot transition from ${order.status} to ${status}` })

    order.status = status
    order.statusHistory.push({ status, note: note || '' })
    if (status === 'completed') order.completedAt = new Date()
    await order.save()

    await Notification.create({
      user: order.buyer,
      title: 'Order Updated',
      message: `Your order #${order.orderNumber} status changed to ${status}`,
      type: 'order',
      link: `/buyer/orders/${order._id}`,
    })

    res.json({ success: true, message: 'Order status updated', order })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// Farmer gets their orders
const getFarmerOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const query = { farmer: req.user._id }
    if (status) query.status = status
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('product', 'variety images bagSize')
        .populate('buyer', 'name phone avatar')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit),
      Order.countDocuments(query),
    ])
    res.json({ success: true, orders, total, pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { placeOrder, getMyOrders, getOrder, cancelOrder, addReview, updateOrderStatus, getFarmerOrders }