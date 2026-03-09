const sanitizeHtml = (str) => {
  if (typeof str !== 'string') return str
  return str.replace(/[<>]/g, '')
}

const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj
  const sanitized = {}
  for (const key of Object.keys(obj)) {
    sanitized[key] = typeof obj[key] === 'string' ? sanitizeHtml(obj[key]) : sanitizeObject(obj[key])
  }
  return sanitized
}

const sanitizeMiddleware = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body)
  if (req.query) req.query = sanitizeObject(req.query)
  next()
}

module.exports = { sanitizeMiddleware }