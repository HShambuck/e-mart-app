const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'GHS' },
  method: { type: String, enum: ['mtn_momo', 'vodafone_cash', 'airteltigo_money', 'bank_transfer', 'cash', 'paystack'], required: true },
  provider: { type: String },
  reference: { type: String, unique: true },
  providerReference: { type: String },
  status: { type: String, enum: ['pending', 'successful', 'failed', 'cancelled', 'refunded'], default: 'pending' },
  paidAt: { type: Date },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true })

module.exports = mongoose.model('Payment', paymentSchema)