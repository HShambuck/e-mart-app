const User = require('../models/User')
const Buyer = require('../models/Buyer')
const Order = require('../models/Order')

const getDashboard = async (req, res) => {
  try {
    const id = req.user._id
    const [totalOrders, activeOrders, completedOrders, recentOrders, spendAgg] = await Promise.all([
      Order.countDocuments({ buyer: id }),
      Order.countDocuments({ buyer: id, status: { $in: ['pending', 'accepted', 'payment_confirmed', 'ready_for_collection'] } }),
      Order.countDocuments({ buyer: id, status: 'completed' }),
      Order.find({ buyer: id }).sort({ createdAt: -1 }).limit(5)
        .populate('product', 'name variety images pricePerBag')
        .populate('farmer', 'name phone avatar'),
      Order.aggregate([
        { $match: { buyer: id, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ])
    res.json({
      success: true,
      stats: { totalOrders, activeOrders, completedOrders, totalSpent: spendAgg[0]?.total || 0 },
      recentOrders,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getProfile = async (req, res) => {
  try {
    const buyer = await Buyer.findOne({ user: req.user._id })
    res.json({ success: true, user: req.user, buyer })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, email, avatar, businessName, businessType, region, district, address, momoNumber, momoProvider } = req.body
    const userUpdate = {}
    if (name) userUpdate.name = name
    if (email) userUpdate.email = email
    if (avatar) userUpdate.avatar = avatar
    await User.findByIdAndUpdate(req.user._id, userUpdate)
    const buyer = await Buyer.findOneAndUpdate(
      { user: req.user._id },
      { businessName, businessType, region, district, address, momoNumber, momoProvider },
      { new: true, upsert: true }
    )
    const user = await User.findById(req.user._id)
    res.json({ success: true, message: 'Profile updated', user, buyer })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getDashboard, getProfile, updateProfile }