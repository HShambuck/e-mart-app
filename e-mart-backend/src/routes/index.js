const express = require('express')
const router = express.Router()

router.use('/auth', require('./authRoutes'))
router.use('/farmer', require('./farmerRoutes'))
router.use('/buyer', require('./buyerRoutes'))
router.use('/admin', require('./adminRoutes'))
router.use('/products', require('./productRoutes'))
router.use('/orders', require('./orderRoutes'))
router.use('/payments', require('./paymentRoutes'))
router.use('/transactions', require('./transactionRoutes'))
router.use('/messages', require('./messageRoutes'))
router.use('/notifications', require('./notificationRoutes'))

module.exports = router