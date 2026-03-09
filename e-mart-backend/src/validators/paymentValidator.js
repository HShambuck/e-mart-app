const { body } = require('express-validator')
const paymentValidator = [
  body('orderId').notEmpty().isMongoId().withMessage('Valid order ID required'),
  body('method').isIn(['mtn_momo', 'vodafone_cash', 'airteltigo_money', 'bank_transfer', 'paystack', 'cash']).withMessage('Invalid payment method'),
  body('momoNumber').optional().matches(/^0[0-9]{9}$/).withMessage('Enter a valid mobile money number'),
]
module.exports = { paymentValidator }