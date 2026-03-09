const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true, lowercase: true, default: null },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['farmer', 'buyer', 'admin'], required: true },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  otp: { type: String, select: false },
  otpExpiry: { type: Date, select: false },
  lastLogin: { type: Date },
}, { timestamps: true })

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password)
}

userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.otp
  delete obj.otpExpiry
  return obj
}

module.exports = mongoose.model('User', userSchema)