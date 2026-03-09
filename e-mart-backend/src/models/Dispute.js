const mongoose = require('mongoose')

const disputeSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  against: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  description: { type: String, required: true },
  evidence: [{ type: String }],
  status: { type: String, enum: ['open', 'under_review', 'resolved', 'closed'], default: 'open' },
  resolution: { type: String },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: { type: Date },
  adminNotes: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Dispute', disputeSchema)