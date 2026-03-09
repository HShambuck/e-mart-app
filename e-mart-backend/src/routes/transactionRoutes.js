const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/authMiddleware')
const { getMyTransactions, getTransaction } = require('../controllers/transactionController')

router.use(protect)
router.get('/', getMyTransactions)
router.get('/:id', getTransaction)

module.exports = router