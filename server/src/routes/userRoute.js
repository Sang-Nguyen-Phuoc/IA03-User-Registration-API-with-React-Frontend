import express from 'express'
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  refreshAccessToken,
  logoutUser
} from '../controllers/userController.js'
import { 
  validateRegister, 
  validateLogin 
} from '../middleware/validator.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.post('/register', validateRegister, registerUser)
router.post('/login', validateLogin, loginUser)
router.post('/refresh', refreshAccessToken) 

// Protected routes
router.post('/logout', protect, logoutUser)
router.get('/', protect, getUserProfile)

export default router