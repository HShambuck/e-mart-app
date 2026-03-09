require('dotenv').config()
const http = require('http')
const app = require('./src/app')
const { connectDB } = require('./src/config/database')
const { initSocket } = require('./src/config/socket')
const logger = require('./src/utils/logger')

const PORT = process.env.PORT || 5000
const server = http.createServer(app)

initSocket(server)

connectDB().then(() => {
  server.listen(PORT, () => {
    logger.info(`🚀 E-MART Server running on port ${PORT} [${process.env.NODE_ENV}]`)
  })
}).catch((err) => {
  logger.error('❌ Failed to start server:', err)
  process.exit(1)
})

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err)
  server.close(() => process.exit(1))
})

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err)
  process.exit(1)
})