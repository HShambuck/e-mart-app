const mongoose = require('mongoose')

const verificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['farmer', 'buyer', 'business'], required: true },
  documents: [{ name: String, url: String, uploadedAt: { type: Date, default: Date.now } }],
  status: { type: String, enum: ['pending', 'under_review', 'approved', 'rejected'], default: 'pending' },
  adminNotes: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true })

module.exports = mongoose.model('Verification', verificationSchema)