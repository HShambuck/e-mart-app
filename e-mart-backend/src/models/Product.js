const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
  name: { type: String, required: true, trim: true },
  variety: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  pricePerBag: { type: Number, required: true, min: 0 },
  bagSize: { type: Number, required: true },
  quantityAvailable: { type: Number, required: true, min: 0 },
  quality: { type: String, enum: ['grade_a', 'grade_b', 'grade_c', 'premium'], default: 'grade_a' },
  harvestDate: { type: Date },
  images: [{ type: String }],
  region: { type: String, trim: true },
  district: { type: String, trim: true },
  status: { type: String, enum: ['available', 'sold_out', 'hidden'], default: 'available' },
  views: { type: Number, default: 0 },
  orders: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isOrganic: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String }],
}, { timestamps: true })

productSchema.index({ farmer: 1, status: 1 })
productSchema.index({ variety: 'text', name: 'text', description: 'text' })
productSchema.index({ region: 1, status: 1 })
productSchema.index({ pricePerBag: 1 })

module.exports = mongoose.model('Product', productSchema)