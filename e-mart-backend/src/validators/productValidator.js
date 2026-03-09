const { body } = require('express-validator')
const productValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('variety').trim().notEmpty().withMessage('Rice variety is required'),
  body('pricePerBag').isFloat({ min: 1 }).withMessage('Price must be greater than 0'),
  body('bagSize').isFloat({ min: 1 }).withMessage('Bag size must be greater than 0'),
  body('quantityAvailable').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('quality').optional().isIn(['grade_a', 'grade_b', 'grade_c', 'premium']).withMessage('Invalid quality grade'),
]
module.exports = { productValidator }