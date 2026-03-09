const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/authMiddleware')
const { authorize } = require('../middlewares/roleMiddleware')
const { validate } = require('../middlewares/validationMiddleware')
const { paymentValidator } = require('../validators/paymentValidator')
const { initializePayment, verifyPayment, getPaymentByOrder, getPaymentHistory } = require('../controllers/paymentController')

router.use(protect)

router.post('/initialize', authorize('buyer'), paymentValidator, validate, initializePayment)
router.post('/verify', authorize('buyer'), verifyPayment)
router.get('/history', getPaymentHistory)
router.get('/order/:orderId', getPaymentByOrder)

module.exports = router