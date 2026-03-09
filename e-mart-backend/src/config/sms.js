const axios = require('axios')
const logger = require('../utils/logger')

// Hubtel SMS Ghana
const sendSMS = async (to, message) => {
  if (process.env.NODE_ENV === 'development') {
    logger.info(`📱 [DEV] SMS to ${to}: ${message}`)
    return { success: true, dev: true }
  }

  try {
    const response = await axios.get('https://smsc.hubtel.com/v1/messages/send', {
      params: {
        clientsecret: process.env.SMS_API_SECRET,
        clientid: process.env.SMS_API_KEY,
        from: process.env.SMS_SENDER_ID || 'E-MART',
        to: to.replace(/^0/, '+233'),
        content: message,
      },
    })
    return { success: true, data: response.data }
  } catch (err) {
    logger.error('SMS send failed:', err.message)
    return { success: false, error: err.message }
  }
}

module.exports = { sendSMS }