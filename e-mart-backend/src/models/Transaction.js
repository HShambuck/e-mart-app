const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  farmerAmount: { type: Number },
  currency: { type: String, default: 'GHS' },
  reference: { type: String, unique: true },
  status: { type: String, enum: ['pending', 'successful', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: { type: String },
  paymentProvider: { type: String },
  escrowStatus: { type: String, enum: ['holding', 'released', 'refunded'], default: 'holding' },
  escrowReleasedAt: { type: Date },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true })

module.exports = mongoose.model('Transaction', transactionSchema)