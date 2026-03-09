const nodemailer = require('nodemailer')
const logger = require('./logger')

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendEmail = async ({ to, subject, html }) => {
  if (process.env.NODE_ENV === 'development') {
    logger.info(`📧 [DEV] Email to ${to}: ${subject}`)
    return { success: true, dev: true }
  }
  try {
    const info = await transporter.sendMail({
      from: `"E-MART" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    })
    return { success: true, messageId: info.messageId }
  } catch (err) {
    logger.error('Email send failed:', err.message)
    return { success: false, error: err.message }
  }
}

module.exports = { sendEmail }