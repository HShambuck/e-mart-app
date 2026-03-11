const { body } = require('express-validator')

const productValidator = [
  body('variety').trim().notEmpty().withMessage('Rice variety is required'),
  body('pricePerBag').isFloat({ min: 1 }).withMessage('Price must be greater than 0'),
  body('bagSize').notEmpty().withMessage('Bag size is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('region').optional().trim(),
  body('harvestDate').optional(),
  body('qualityDescription').optional().trim(),
  body('status').optional().isIn(['available', 'out_of_stock']).withMessage('Invalid status'),
]

module.exports = { productValidator }