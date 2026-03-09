const { generateOTP, getOTPExpiry } = require('../utils/generateOTP')
const { sendOTPSMS } = require('../utils/sendSMS')
const logger = require('../utils/logger')

const sendOTP = async (user) => {
  const otp = generateOTP()
  const expiry = getOTPExpiry(10)
  user.otp = otp
  user.otpExpiry = expiry
  await user.save({ validateBeforeSave: false })
  await sendOTPSMS(user.phone, otp)
  logger.info(`OTP sent to ${user.phone}`)
  return otp
}

const verifyOTP = async (user, otp) => {
  if (user.otp !== otp) return { valid: false, message: 'Invalid OTP' }
  if (new Date() > user.otpExpiry) return { valid: false, message: 'OTP has expired' }
  return { valid: true }
}

module.exports = { sendOTP, verifyOTP }