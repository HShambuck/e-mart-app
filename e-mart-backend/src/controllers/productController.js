const Product = require('../models/Product')
const Farmer = require('../models/Farmer')
const { uploadMultiple } = require('../utils/imageProcessor')

const getProducts = async (req, res) => {
  try {
    const { search, variety, region, minPrice, maxPrice, quality, page = 1, limit = 12, sort = '-createdAt' } = req.query
    const query = { status: 'available', quantityAvailable: { $gt: 0 } }
    if (search) query.$text = { $search: search }
    if (variety) query.variety = { $regex: variety, $options: 'i' }
    if (region) query.region = { $regex: region, $options: 'i' }
    if (quality) query.quality = quality
    if (minPrice || maxPrice) {
      query.pricePerBag = {}
      if (minPrice) query.pricePerBag.$gte = Number(minPrice)
      if (maxPrice) query.pricePerBag.$lte = Number(maxPrice)
    }
    const [products, total] = await Promise.all([
      Product.find(query).populate('farmer', 'name avatar').populate('farmerProfile', 'region rating isVerified verificationBadge')
        .sort(sort).limit(limit * 1).skip((page - 1) * limit),
      Product.countDocuments(query),
    ])
    res.json({ success: true, products, total, pages: Math.ceil(total / limit), page: Number(page) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'name avatar phone')
      .populate('farmerProfile', 'region district farmName rating totalReviews isVerified verificationBadge')
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })
    res.json({ success: true, product })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const createProduct = async (req, res) => {
  try {
    const { name, variety, description, pricePerBag, bagSize, quantityAvailable, quality, harvestDate, region, district, isOrganic, tags } = req.body
    const farmerProfile = await Farmer.findOne({ user: req.user._id })
    const product = await Product.create({
      farmer: req.user._id,
      farmerProfile: farmerProfile?._id,
      name, variety, description, pricePerBag, bagSize, quantityAvailable, quality, harvestDate, region, district, isOrganic, tags,
    })
    res.status(201).json({ success: true, message: 'Product created', product })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, farmer: req.user._id })
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    const fields = ['name', 'variety', 'description', 'pricePerBag', 'bagSize', 'quantityAvailable', 'quality', 'harvestDate', 'region', 'district', 'isOrganic', 'tags', 'status']
    fields.forEach(f => { if (req.body[f] !== undefined) product[f] = req.body[f] })
    await product.save()
    res.json({ success: true, message: 'Product updated', product })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, farmer: req.user._id })
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    res.json({ success: true, message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getMyProducts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const query = { farmer: req.user._id }
    if (status) query.status = status
    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit),
      Product.countDocuments(query),
    ])
    res.json({ success: true, products, total, pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const uploadImages = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, farmer: req.user._id })
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    if (!req.files?.length) return res.status(400).json({ success: false, message: 'No images provided' })
    const urls = await uploadMultiple(req.files, 'emart/products')
    product.images = [...product.images, ...urls]
    await product.save()
    res.json({ success: true, message: 'Images uploaded', images: product.images })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getMyProducts, uploadImages }