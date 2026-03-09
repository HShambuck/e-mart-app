const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Farmer = require('../models/Farmer')
const Buyer = require('../models/Buyer')
const { generateToken } = require('../utils/generateToken')

const register = async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body

    if (!name || !phone || !password || !role)
      return res.status(400).json({ success: false, message: 'All fields are required' })

    if (!['farmer', 'buyer'].includes(role))
      return res.status(400).json({ success: false, message: 'Invalid role' })

    const existing = await User.findOne({ phone })
    if (existing)
      return res.status(400).json({ success: false, message: 'Phone number already registered' })

    // ✅ Hash password manually — no pre-save hook needed
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      phone,
      email: email || undefined,
      password: hashedPassword,
      role,
      isVerified: true,
    })

    if (role === 'farmer') await Farmer.create({ user: user._id })
    else await Buyer.create({ user: user._id })

    const token = generateToken(user._id, user.role)

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: user.toJSON(),
    })
  } catch (err) {
    console.error('Register error:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body

    if (!emailOrPhone || !password)
      return res.status(400).json({ success: false, message: 'Please provide credentials' })

    const user = await User.findOne({
      $or: [{ phone: emailOrPhone }, { email: emailOrPhone }],
    }).select('+password')

    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' })

    if (!user.isActive)
      return res.status(401).json({ success: false, message: 'Account deactivated. Contact support.' })

    // ✅ Update lastLogin without triggering any hooks
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })

    const token = generateToken(user._id, user.role)

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: user.toJSON(),
    })
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const logout = (req, res) => res.json({ success: true, message: 'Logged out successfully' })

const verifyOTP  = (req, res) => res.json({ success: true, message: 'OTP disabled in dev mode' })
const resendOTP  = (req, res) => res.json({ success: true, message: 'OTP disabled in dev mode' })
const changePassword = (req, res) => res.json({ success: true, message: 'Not implemented yet' })

module.exports = { register, verifyOTP, resendOTP, login, getMe, logout, changePassword }