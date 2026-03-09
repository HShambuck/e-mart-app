const express = require('express')
const router = express.Router()
const { register, verifyOTP, resendOTP, login, getMe, logout } = require('../controllers/authController')
const { protect } = require('../middlewares/authMiddleware')
const { validate } = require('../middlewares/validationMiddleware')
const { authLimiter, otpLimiter } = require('../middlewares/rateLimitMiddleware')
const { registerValidator, loginValidator, otpValidator } = require('../validators/authValidator')

router.post('/register', authLimiter, registerValidator, validate, register)
router.post('/verify-otp', otpLimiter, otpValidator, validate, verifyOTP)
router.post('/resend-otp', otpLimiter, resendOTP)
router.post('/login', authLimiter, loginValidator, validate, login)
router.get('/me', protect, getMe)
router.post('/logout', protect, logout)

module.exports = router