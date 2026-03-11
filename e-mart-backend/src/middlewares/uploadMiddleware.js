const multer = require('multer')
const path = require('path')

// Use memory storage — avoids /tmp filesystem issues on Railway
// Files available as req.files[].buffer
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/
  const isValid = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)
  if (isValid) return cb(null, true)
  cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)'))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

module.exports = { upload }