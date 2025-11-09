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
]

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    // Check if the origin matches any allowed origins or patterns
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        const pattern = new RegExp('^' + allowedOrigin.replace('*', '.*') + '$')
        return pattern.test(origin)
      }
      return allowedOrigin === origin
    })
    
    if (isAllowed) {
      callback(null, true)
    } else {
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
    message: 'User Registration API',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    server: {
      timestamp: new Date().toISOString(),
      cors: {
        allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
      }
    },
    endpoints: {
      register: 'POST /api/user/register',
      login: 'POST /api/user/login',
      profile: 'GET /api/user/profile'
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
app.use('/api/user', userRoutes)

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
        'POST /api/user/register',
        'POST /api/user/login',
        'GET /api/user'
      ]
    },
    help: 'Make sure you are including /api in your request URL'
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