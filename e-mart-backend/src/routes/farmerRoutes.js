const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/authMiddleware')
const { authorize } = require('../middlewares/roleMiddleware')
const { getDashboard, getProfile, updateProfile, getOrders, getOrder, updateOrderStatus, getSales } = require('../controllers/farmerController')

router.use(protect, authorize('farmer'))

router.get('/dashboard', getDashboard)
router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.get('/orders', getOrders)
router.get('/orders/:id', getOrder)
router.put('/orders/:id/status', updateOrderStatus)
router.get('/sales', getSales)

module.exports = router