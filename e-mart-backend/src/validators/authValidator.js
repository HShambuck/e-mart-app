const { body } = require('express-validator')
const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name too short'),
  body('phone').trim().matches(/^0[0-9]{9}$/).withMessage('Enter a valid Ghana phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['farmer', 'buyer']).withMessage('Role must be farmer or buyer'),
  body('email').optional().isEmail().withMessage('Enter a valid email'),
]
const loginValidator = [
  body('emailOrPhone').notEmpty().withMessage('Email or phone is required'),
  body('password').notEmpty().withMessage('Password is required'),
]
const otpValidator = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be 6 digits'),
]
module.exports = { registerValidator, loginValidator, otpValidator }