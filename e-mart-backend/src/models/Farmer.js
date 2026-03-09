const mongoose = require('mongoose')

const farmerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  farmName: { type: String, trim: true },
  region: { type: String, trim: true },
  district: { type: String, trim: true },
  farmSize: { type: Number },
  cooperative: { type: String, trim: true },
  riceVarieties: [{ type: String }],
  bio: { type: String, maxlength: 500 },
  isVerified: { type: Boolean, default: false },
  verificationBadge: { type: String, enum: ['none', 'basic', 'premium'], default: 'none' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  completedOrders: { type: Number, default: 0 },
  bankDetails: {
    bankName: String,
    accountNumber: String,
    accountName: String,
    momoNumber: String,
    momoProvider: { type: String, enum: ['mtn', 'vodafone', 'airteltigo'] },
  },
}, { timestamps: true })

module.exports = mongoose.model('Farmer', farmerSchema)