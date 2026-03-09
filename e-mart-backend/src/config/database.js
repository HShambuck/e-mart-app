const mongoose = require('mongoose')
const logger = require('../utils/logger')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { dbName: 'emart' })
    logger.info(`✅ MongoDB connected: ${conn.connection.host}`)

    mongoose.connection.on('error', (err) => logger.error('MongoDB error:', err))
    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'))

    return conn
  } catch (err) {
    logger.error('❌ MongoDB connection failed:', err.message)
    throw err
  }
}

module.exports = { connectDB }