const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { errorHandler, notFound } = require('./middlewares/errorMiddleware')
const { generalLimiter } = require('./middlewares/rateLimitMiddleware')
const routes = require('./routes/index')

const app = express()

// Security
app.use(helmet())

// ✅ Fixed: support both CRA (3000) and Vite (5173) dev servers
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting
app.use('/api', generalLimiter)

// Health check
app.get('/health', (req, res) =>
  res.json({ status: 'ok', env: process.env.NODE_ENV, timestamp: new Date().toISOString() })
)

// Routes
app.use('/api', routes)

// Error handling
app.use(notFound)
app.use(errorHandler)

module.exports = app