const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/authMiddleware')
const { authorize } = require('../middlewares/roleMiddleware')
const { getDashboard, getProfile, updateProfile } = require('../controllers/buyerController')

router.use(protect, authorize('buyer'))

router.get('/dashboard', getDashboard)
router.get('/profile', getProfile)
router.put('/profile', updateProfile)

module.exports = router