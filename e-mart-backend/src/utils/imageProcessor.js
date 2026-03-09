const cloudinary = require('../config/cloudinary')
const logger = require('./logger')

const uploadImage = async (filePath, folder = 'emart') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      transformation: [{ width: 800, height: 600, crop: 'fill', quality: 'auto' }],
    })
    return { success: true, url: result.secure_url, publicId: result.public_id }
  } catch (err) {
    logger.error('Image upload failed:', err.message)
    return { success: false, error: err.message }
  }
}

const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId)
    return { success: true }
  } catch (err) {
    logger.error('Image delete failed:', err.message)
    return { success: false, error: err.message }
  }
}

const uploadMultiple = async (files, folder = 'emart') => {
  const results = await Promise.all(files.map(f => uploadImage(f.path, folder)))
  return results.filter(r => r.success).map(r => r.url)
}

module.exports = { uploadImage, deleteImage, uploadMultiple }