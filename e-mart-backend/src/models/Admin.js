const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  permissions: [{
    type: String,
    enum: ['manage_users', 'manage_products', 'manage_orders', 'manage_payments', 'manage_disputes', 'view_reports', 'full_access'],
  }],
  isSuperAdmin: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Admin', adminSchema)