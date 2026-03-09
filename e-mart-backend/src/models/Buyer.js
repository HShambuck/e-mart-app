const mongoose = require('mongoose')

const buyerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String, trim: true },
  businessType: { type: String, enum: ['individual', 'retailer', 'wholesaler', 'restaurant', 'other'], default: 'individual' },
  region: { type: String, trim: true },
  district: { type: String, trim: true },
  address: { type: String, trim: true },
  preferredVarieties: [{ type: String }],
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  momoNumber: { type: String },
  momoProvider: { type: String, enum: ['mtn', 'vodafone', 'airteltigo'] },
}, { timestamps: true })

module.exports = mongoose.model('Buyer', buyerSchema)