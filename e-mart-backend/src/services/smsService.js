const { sendSMS } = require('../utils/sendSMS')

const sendOrderNotificationSMS = async (phone, orderNumber, status) => {
  const messages = {
    accepted: `E-MART: Order #${orderNumber} accepted. Login to make payment.`,
    payment_confirmed: `E-MART: Payment confirmed for #${orderNumber}.`,
    ready_for_collection: `E-MART: Order #${orderNumber} ready for collection!`,
    completed: `E-MART: Order #${orderNumber} completed. Thank you!`,
    cancelled: `E-MART: Order #${orderNumber} has been cancelled.`,
  }
  if (messages[status]) return sendSMS(phone, messages[status])
}

module.exports = { sendOrderNotificationSMS }