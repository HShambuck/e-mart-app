const { sendEmail } = require('../utils/sendEmail')

const sendWelcomeEmail = (user) => sendEmail({ to: user.email, subject: 'Welcome to E-MART! 🌾', html: `<h2>Welcome, ${user.name}!</h2><p>Your account is ready.</p>` })
const sendOrderConfirmationEmail = (email, order) => sendEmail({ to: email, subject: `Order Confirmed - #${order.orderNumber}`, html: `<h2>Order Confirmed!</h2><p>Total: GHS ${order.totalAmount}</p>` })

module.exports = { sendWelcomeEmail, sendOrderConfirmationEmail }