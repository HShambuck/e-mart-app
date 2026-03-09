const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  pricePerBag: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  farmerAmount: { type: Number },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'payment_pending', 'payment_confirmed', 'ready_for_collection', 'completed', 'cancelled', 'disputed'],
    default: 'pending',
  },
  paymentStatus: { type: String, enum: ['unpaid', 'pending', 'paid', 'refunded', 'failed'], default: 'unpaid' },
  paymentMethod: { type: String, enum: ['mtn_momo', 'vodafone_cash', 'airteltigo_money', 'bank_transfer', 'cash'] },
  paymentReference: { type: String },
  pickupDetails: { location: String, date: Date, notes: String },
  buyerNotes: { type: String },
  farmerNotes: { type: String },
  cancelReason: { type: String },
  cancelledBy: { type: String, enum: ['buyer', 'farmer', 'admin'] },
  completedAt: { type: Date },
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: Date,
  },
  statusHistory: [{ status: String, timestamp: { type: Date, default: Date.now }, note: String }],
}, { timestamps: true })

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments()
    this.orderNumber = `EM${String(count + 1).padStart(6, '0')}`
  }
  if (!this.farmerAmount) this.farmerAmount = this.totalAmount - this.platformFee
  next()
})

orderSchema.index({ buyer: 1, createdAt: -1 })
orderSchema.index({ farmer: 1, createdAt: -1 })
orderSchema.index({ status: 1 })

module.exports = mongoose.model('Order', orderSchema)