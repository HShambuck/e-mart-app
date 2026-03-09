const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/authMiddleware')
const { authorize } = require('../middlewares/roleMiddleware')
const { validate } = require('../middlewares/validationMiddleware')
const { orderValidator } = require('../validators/orderValidator')
const { placeOrder, getMyOrders, getOrder, cancelOrder, addReview } = require('../controllers/orderController')

router.use(protect)

router.post('/', authorize('buyer'), orderValidator, validate, placeOrder)
router.get('/my', getMyOrders)
router.get('/:id', getOrder)
router.put('/:id/cancel', cancelOrder)
router.post('/:id/review', authorize('buyer'), addReview)

module.exports = router