const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/authMiddleware')
const { authorize } = require('../middlewares/roleMiddleware')
const {
  getDashboard, getUsers, getUser, toggleUserActive,
  getProducts, toggleFeatureProduct,
  getOrders, getTransactions,
  getVerifications, reviewVerification,
  getDisputes, resolveDispute,
  broadcastNotification,
} = require('../controllers/adminController')

router.use(protect, authorize('admin'))

router.get('/dashboard', getDashboard)

router.get('/users', getUsers)
router.get('/users/:id', getUser)
router.put('/users/:id/toggle-active', toggleUserActive)

router.get('/products', getProducts)
router.put('/products/:id/feature', toggleFeatureProduct)

router.get('/orders', getOrders)
router.get('/transactions', getTransactions)

router.get('/verifications', getVerifications)
router.put('/verifications/:id', reviewVerification)

router.get('/disputes', getDisputes)
router.put('/disputes/:id/resolve', resolveDispute)

router.post('/broadcast', broadcastNotification)

module.exports = router