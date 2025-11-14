import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import userRoutes from './routes/userRoute.js'
import { errorHandler } from './middleware/errorHandler.js'

// Load environment variables
dotenv.config()

// Create Express app
const app = express()

// Connect to MongoDB
connectDB()

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',  
  process.env.FRONTEND_URL,
"https://ia-03-user-registration-api-with-re-zeta.vercel.app/", 
  'https://*.onrender.com'
].filter(Boolean)

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request Logging (Development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    next()
  })
}

// Root Route
app.get('/', (req, res) => {
  res.json({
    success: true,
     message: 'User Registration API with Access & Refresh Tokens',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    endpoints: {
      register: 'POST /user/register',
      login: 'POST /user/login',
      refresh: 'POST /user/refresh',
      logout: 'POST /user/logout',
      profile: 'GET /user'
    },
    tokenInfo: {
      accessTokenExpiry: '5 minutes',
      refreshTokenExpiry: '7 days'
    }
  })
})

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API Routes
app.use('/user', userRoutes)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    request: {
      path: req.path,
      method: req.method,
      originalUrl: req.originalUrl,
      baseUrl: req.baseUrl
    },
    availableRoutes: {
      auth: [
        'POST user/register',
        'POST user/login',
        'GET user'
      ]
    },
  })
})

// Error Handler (Must be last)
app.use(errorHandler)

// Start Server
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50))
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🌐 Server URL: http://localhost:${PORT}`)
  console.log('='.repeat(50))
})

// Graceful Shutdown
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err)
  server.close(() => process.exit(1))
})

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully')
  server.close(() => console.log('✅ Process terminated'))
})

export default app