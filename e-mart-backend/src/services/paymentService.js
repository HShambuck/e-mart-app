const axios = require('axios')
const PAYMENT_CONFIG = require('../config/payment')
const Payment = require('../models/Payment')
const Transaction = require('../models/Transaction')
const Order = require('../models/Order')
const logger = require('../utils/logger')

const generateReference = () => `EMART-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

const initializePaystack = async (order, buyer) => {
  try {
    const reference = generateReference()
    const response = await axios.post(`${PAYMENT_CONFIG.paystack.baseUrl}/transaction/initialize`, {
      email: buyer.email || `${buyer.phone}@emart.com`,
      amount: order.totalAmount * 100,
      reference,
      currency: 'GHS',
      metadata: { orderId: order._id, buyerId: buyer._id },
    }, { headers: { Authorization: `Bearer ${PAYMENT_CONFIG.paystack.secretKey}` } })
    await Payment.create({ order: order._id, buyer: buyer._id, amount: order.totalAmount, method: 'paystack', reference, status: 'pending' })
    return { success: true, reference, authorizationUrl: response.data.data.authorization_url }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

const verifyPaystack = async (reference) => {
  try {
    const response = await axios.get(`${PAYMENT_CONFIG.paystack.baseUrl}/transaction/verify/${reference}`, { headers: { Authorization: `Bearer ${PAYMENT_CONFIG.paystack.secretKey}` } })
    return { success: true, data: response.data.data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

const processMoMo = async (order, buyer, momoNumber, provider) => {
  const reference = generateReference()
  if (process.env.NODE_ENV === 'development') {
    logger.info(`📱 MoMo: ${provider} ${momoNumber} GHS ${order.totalAmount}`)
    await Payment.create({ order: order._id, buyer: buyer._id, amount: order.totalAmount, method: provider, reference, momoNumber, status: 'success', paidAt: new Date() })
    return { success: true, reference, mock: true }
  }
  return { success: true, reference }
}

const confirmPayment = async (orderId, reference) => {
  try {
    const order = await Order.findById(orderId)
    if (!order) return { success: false, error: 'Order not found' }
    order.paymentStatus = 'paid'
    order.status = 'payment_confirmed'
    order.statusHistory.push({ status: 'payment_confirmed', note: `Payment confirmed. Ref: ${reference}` })
    await order.save()
    await Transaction.create({ order: order._id, buyer: order.buyer, farmer: order.farmer, amount: order.totalAmount, platformFee: order.platformFee, farmerAmount: order.farmerAmount, status: 'completed', escrowStatus: 'held', reference })
    return { success: true, order }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

module.exports = { initializePaystack, verifyPaystack, processMoMo, confirmPayment, generateReference }