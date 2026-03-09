const { uploadMultiple, uploadToCloudinary } = require('../utils/imageProcessor')

const uploadProductImages = (files) => uploadMultiple(files, 'emart/products')
const uploadAvatar = (file) => uploadToCloudinary(file.path, 'emart/avatars')
const uploadDocument = (file) => uploadToCloudinary(file.path, 'emart/documents')

module.exports = { uploadProductImages, uploadAvatar, uploadDocument }