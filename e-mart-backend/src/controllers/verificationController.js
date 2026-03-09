const Verification = require('../models/Verification')
const { asyncHandler, AppError } = require('../utils/errorHandler')
const { uploadDocument } = require('../services/uploadService')

// @route POST /api/verifications
exports.submitVerification = asyncHandler(async (req, res) => {
  const { type } = req.body

  const existing = await Verification.findOne({ user: req.user._id, type, status: { $in: ['pending', 'under_review'] } })
  if (existing) throw new AppError('You already have a pending verification request', 400)

  const documents = []
  if (req.files?.length) {
    for (const file of req.files) {
      const result = await uploadDocument(file)
      if (result.success) documents.push({ name: file.originalname, url: result.url })
    }
  }

  const verification = await Verification.create({
    user: req.user._id,
    type,
    documents,
  })

  res.status(201).json({ success: true, message: 'Verification submitted successfully', verification })
})

// @route GET /api/verifications/my
exports.getMyVerifications = asyncHandler(async (req, res) => {
  const verifications = await Verification.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json({ success: true, verifications })
})