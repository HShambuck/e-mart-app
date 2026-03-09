const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

const getOTPExpiry = (minutes = 10) => new Date(Date.now() + minutes * 60 * 1000)

module.exports = { generateOTP, getOTPExpiry }