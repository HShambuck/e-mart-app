const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/authMiddleware')
const { authorize } = require('../middlewares/roleMiddleware')
const { validate } = require('../middlewares/validationMiddleware')
const { upload } = require('../middlewares/uploadMiddleware')
const { productValidator } = require('../validators/productValidator')
const { getProducts, getProduct, getMyProducts, createProduct, updateProduct, deleteProduct, uploadImages } = require('../controllers/productController')

router.get('/', getProducts)
router.get('/my', protect, authorize('farmer'), getMyProducts)
router.get('/:id', getProduct)
router.post('/', protect, authorize('farmer'), productValidator, validate, createProduct)
router.put('/:id', protect, authorize('farmer'), updateProduct)
router.delete('/:id', protect, authorize('farmer'), deleteProduct)
router.post('/:id/images', protect, authorize('farmer'), upload.array('images', 5), uploadImages)

module.exports = router