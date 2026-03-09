const { sendSMS: sendViaSMS } = require('../config/sms')
const logger = require('./logger')

const sendOTPSMS = async (phone, otp) => {
  const message = `Your E-MART verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`
  return sendViaSMS(phone, message)
}

const sendOrderSMS = async (phone, message) => {
  return sendViaSMS(phone, `E-MART: ${message}`)
}

module.exports = { sendOTPSMS, sendOrderSMS }