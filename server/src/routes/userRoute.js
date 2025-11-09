import express from 'express'
import { 
  registerUser, 
  loginUser, 
  getUserProfile 
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

// Protected routes
router.get('/', protect, getUserProfile)

export default router