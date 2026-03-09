const Transaction = require('../models/Transaction')
const Farmer = require('../models/Farmer')
const Order = require('../models/Order')
const logger = require('../utils/logger')

const releaseEscrow = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
    const transaction = await Transaction.findOne({ order: orderId, escrowStatus: 'held' })
    if (!transaction) return { success: false, error: 'No held transaction' }
    transaction.escrowStatus = 'released'
    transaction.escrowReleasedAt = new Date()
    await transaction.save()
    await Farmer.findOneAndUpdate({ user: order.farmer }, { $inc: { totalEarnings: transaction.farmerAmount, completedOrders: 1, totalSales: order.quantity } })
    return { success: true, amount: transaction.farmerAmount }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

const refundEscrow = async (orderId) => {
  try {
    const transaction = await Transaction.findOne({ order: orderId })
    if (!transaction) return { success: false, error: 'Transaction not found' }
    transaction.escrowStatus = 'refunded'
    transaction.status = 'refunded'
    await transaction.save()
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

module.exports = { releaseEscrow, refundEscrow }