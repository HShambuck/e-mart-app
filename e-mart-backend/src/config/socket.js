const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

let io

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) return next(new Error('Authentication error'))
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.userId = decoded.id
      socket.userRole = decoded.role
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    logger.info(`🔌 Socket connected: ${socket.userId}`)
    socket.join(`user_${socket.userId}`)

    socket.on('join_conversation', (userId) => socket.join(`conv_${userId}`))
    socket.on('leave_conversation', (userId) => socket.leave(`conv_${userId}`))
    socket.on('typing', ({ to }) => socket.to(`user_${to}`).emit('user_typing', { from: socket.userId }))
    socket.on('stop_typing', ({ to }) => socket.to(`user_${to}`).emit('user_stop_typing', { from: socket.userId }))
    socket.on('disconnect', () => logger.info(`🔌 Socket disconnected: ${socket.userId}`))
  })

  return io
}

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized')
  return io
}

const emitToUser = (userId, event, data) => {
  try {
    if (!io) return
    io.to(`user_${userId}`).emit(event, data)
  } catch (err) {
    logger.warn('Socket emit failed:', err.message)
  }
}

module.exports = { initSocket, getIO, emitToUser }