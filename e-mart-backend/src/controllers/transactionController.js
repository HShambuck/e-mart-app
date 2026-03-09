const Transaction = require('../models/Transaction')
const { asyncHandler, AppError } = require('../utils/errorHandler')

// @route GET /api/transactions
exports.getMyTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query
  const isFarmer = req.user.role === 'farmer'
  const query = isFarmer ? { farmer: req.user._id } : { buyer: req.user._id }

  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .populate('order', 'orderNumber quantity')
      .populate(isFarmer ? { path: 'buyer', select: 'name phone' } : { path: 'farmer', select: 'name phone' })
      .sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit),
    Transaction.countDocuments(query),
  ])

  const totalAmount = await Transaction.aggregate([
    { $match: { ...query, status: 'completed' } },
    { $group: { _id: null, total: { $sum: isFarmer ? '$farmerAmount' : '$amount' } } },
  ])

  res.json({ success: true, transactions, total, pages: Math.ceil(total / limit), totalAmount: totalAmount[0]?.total || 0 })
})

// @route GET /api/transactions/:id
exports.getTransaction = asyncHandler(async (req, res) => {
  const isFarmer = req.user.role === 'farmer'
  const query = { _id: req.params.id, ...(isFarmer ? { farmer: req.user._id } : { buyer: req.user._id }) }
  if (req.user.role === 'admin') delete query.farmer, delete query.buyer

  const transaction = await Transaction.findOne(query)
    .populate('order').populate('buyer', 'name phone').populate('farmer', 'name phone')
  if (!transaction) throw new AppError('Transaction not found', 404)
  res.json({ success: true, transaction })
})