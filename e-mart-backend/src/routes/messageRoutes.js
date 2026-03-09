const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/authMiddleware')
const { getConversations, getMessages, sendMessage, markAsRead, getUnreadCount } = require('../controllers/messageController')

router.use(protect)
router.get('/conversations', getConversations)
router.get('/unread/count', getUnreadCount)
router.get('/:userId', getMessages)
router.post('/', sendMessage)
router.put('/:userId/read', markAsRead)

module.exports = router