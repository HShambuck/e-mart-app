const Order = require('../models/Order')
const Product = require('../models/Product')
const User = require('../models/User')

const getPlatformStats = async () => {
  const [totalUsers, totalProducts, totalOrders, revenueData] = await Promise.all([
    User.countDocuments({ isActive: true }),
    Product.countDocuments({ status: 'available' }),
    Order.countDocuments(),
    Order.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$totalAmount' }, fees: { $sum: '$platformFee' } } }]),
  ])
  return { totalUsers, totalProducts, totalOrders, totalRevenue: revenueData[0]?.total || 0, platformFees: revenueData[0]?.fees || 0 }
}

const getMonthlyRevenue = async (year = new Date().getFullYear()) => {
  return Order.aggregate([
    { $match: { status: 'completed', completedAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } },
    { $group: { _id: { $month: '$completedAt' }, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
    { $sort: { '_id': 1 } },
  ])
}

module.exports = { getPlatformStats, getMonthlyRevenue }