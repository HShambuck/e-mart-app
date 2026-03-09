const Order = require('../models/Order')
const Payment = require('../models/Payment')
const { asyncHandler, AppError } = require('../utils/errorHandler')
const { initializePaystack, verifyPaystack, processMoMo, confirmPayment, generateReference } = require('../services/paymentService')
const { notifyPaymentReceived } = require('../services/notificationService')
const { sendOrderNotificationSMS } = require('../services/smsService')

// @route POST /api/payments/initialize
exports.initializePayment = asyncHandler(async (req, res) => {
  const { orderId, method, momoNumber } = req.body

  const order = await Order.findOne({ _id: orderId, buyer: req.user._id })
  if (!order) throw new AppError('Order not found', 404)
  if (order.paymentStatus === 'paid') throw new AppError('Order already paid', 400)
  if (!['accepted', 'pending'].includes(order.status)) throw new AppError('Order cannot be paid at this stage', 400)

  let result

  if (method === 'paystack') {
    result = await initializePaystack(order, req.user)
    if (!result.success) throw new AppError('Payment initialization failed', 500)
    return res.json({ success: true, method: 'paystack', authorizationUrl: result.authorizationUrl, reference: result.reference })
  }

  if (['mtn_momo', 'vodafone_cash', 'airteltigo_money'].includes(method)) {
    if (!momoNumber) throw new AppError('Mobile money number is required', 400)
    result = await processMoMo(order, req.user, momoNumber, method)
    if (!result.success) throw new AppError('Mobile money payment failed', 500)

    const confirmed = await confirmPayment(orderId, result.reference)
    if (!confirmed.success) throw new AppError('Payment confirmation failed', 500)

    await notifyPaymentReceived(order.farmer, confirmed.order)
    await sendOrderNotificationSMS(req.user.phone, confirmed.order.orderNumber, 'payment_confirmed')

    return res.json({ success: true, message: 'Payment successful', reference: result.reference, order: confirmed.order })
  }

  if (method === 'cash') {
    const reference = generateReference()
    await Payment.create({ order: order._id, buyer: req.user._id, amount: order.totalAmount, method: 'cash', reference, status: 'pending' })
    order.paymentMethod = 'cash'
    order.paymentStatus = 'pending'
    order.statusHistory.push({ status: order.status, note: 'Cash payment selected — awaiting confirmation' })
    await order.save()
    return res.json({ success: true, message: 'Cash payment noted. Confirm with farmer at pickup.', reference })
  }

  throw new AppError('Invalid payment method', 400)
})

// @route POST /api/payments/verify
exports.verifyPayment = asyncHandler(async (req, res) => {
  const { reference } = req.body

  const verification = await verifyPaystack(reference)
  if (!verification.success) throw new AppError('Payment verification failed', 400)

  const paystackData = verification.data
  if (paystackData.status !== 'success') throw new AppError('Payment was not successful', 400)

  const payment = await Payment.findOne({ reference })
  if (!payment) throw new AppError('Payment record not found', 404)

  payment.status = 'success'
  payment.providerReference = paystackData.id
  payment.paidAt = new Date()
  payment.metadata = paystackData
  await payment.save()

  const confirmed = await confirmPayment(payment.order.toString(), reference)
  if (!confirmed.success) throw new AppError('Order confirmation failed', 500)

  await notifyPaymentReceived(confirmed.order.farmer, confirmed.order)

  res.json({ success: true, message: 'Payment verified', order: confirmed.order })
})

// @route GET /api/payments/order/:orderId
exports.getPaymentByOrder = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ order: req.params.orderId })
    .populate('order', 'orderNumber totalAmount status')
  if (!payment) throw new AppError('Payment not found', 404)
  res.json({ success: true, payment })
})

// @route GET /api/payments/history
exports.getPaymentHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query
  const [payments, total] = await Promise.all([
    Payment.find({ buyer: req.user._id })
      .populate('order', 'orderNumber totalAmount status')
      .sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit),
    Payment.countDocuments({ buyer: req.user._id }),
  ])
  res.json({ success: true, payments, total, pages: Math.ceil(total / limit) })
})