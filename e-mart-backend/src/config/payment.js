const axios = require('axios')
const logger = require('../utils/logger')

const PAYSTACK_BASE = 'https://api.paystack.co'

const paystackHeaders = {
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  'Content-Type': 'application/json',
}

const initializePayment = async ({ email, amount, reference, metadata }) => {
  try {
    const response = await axios.post(`${PAYSTACK_BASE}/transaction/initialize`, {
      email,
      amount: Math.round(amount * 100), // convert to pesewas
      reference,
      metadata,
      currency: 'GHS',
    }, { headers: paystackHeaders })
    return { success: true, data: response.data.data }
  } catch (err) {
    logger.error('Paystack init failed:', err.response?.data || err.message)
    return { success: false, error: err.response?.data?.message || err.message }
  }
}

const verifyPayment = async (reference) => {
  try {
    const response = await axios.get(`${PAYSTACK_BASE}/transaction/verify/${reference}`, { headers: paystackHeaders })
    return { success: true, data: response.data.data }
  } catch (err) {
    logger.error('Paystack verify failed:', err.response?.data || err.message)
    return { success: false, error: err.response?.data?.message || err.message }
  }
}

module.exports = { initializePayment, verifyPayment }