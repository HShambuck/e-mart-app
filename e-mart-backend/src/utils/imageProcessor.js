const cloudinary = require('../config/cloudinary')
const logger = require('./logger')

const uploadFromBuffer = (buffer, folder = 'emart') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [{ width: 800, height: 600, crop: 'fill', quality: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    stream.end(buffer)
  })
}

const uploadImage = async (file, folder = 'emart') => {
  try {
    const result = file.buffer
      ? await uploadFromBuffer(file.buffer, folder)
      : await cloudinary.uploader.upload(file.path, { folder, transformation: [{ width: 800, height: 600, crop: 'fill', quality: 'auto' }] })
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
  const results = await Promise.all(files.map(f => uploadImage(f, folder)))
  return results.filter(r => r.success).map(r => r.url)
}

module.exports = { uploadImage, deleteImage, uploadMultiple }