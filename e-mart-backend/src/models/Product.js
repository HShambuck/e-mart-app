const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
  variety: { type: String, required: true, trim: true },
  pricePerBag: { type: Number, required: true, min: 0 },
  bagSize: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 0 },
  qualityDescription: { type: String, trim: true },
  harvestDate: { type: Date },
  images: [{ type: String }],
  location: { type: String, trim: true },
  region: { type: String, trim: true },
  status: { type: String, enum: ['available', 'out_of_stock', 'sold'], default: 'available' },
  views: { type: Number, default: 0 },
  orders: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true })

productSchema.index({ farmer: 1, status: 1 })
productSchema.index({ variety: 'text', qualityDescription: 'text', location: 'text' })
productSchema.index({ region: 1, status: 1 })
productSchema.index({ pricePerBag: 1 })

module.exports = mongoose.model('Product', productSchema)