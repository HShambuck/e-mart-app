const { body } = require('express-validator')
const orderValidator = [
  body('productId').notEmpty().isMongoId().withMessage('Valid product ID required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('paymentMethod').isIn(['mtn_momo', 'vodafone_cash', 'airteltigo_money', 'bank_transfer', 'cash']).withMessage('Invalid payment method'),
]
module.exports = { orderValidator }