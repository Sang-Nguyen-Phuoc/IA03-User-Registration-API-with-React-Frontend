import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  )
}

// Generate Refresh Token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )
}

// @desc    Register new user
// @route   POST /user/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      })
    }

    const { email, password } = req.body

    // Check if user exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists. Please use a different email or login.'
      })
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password
    })

    // Generate token
    const token = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    // Save refresh token
    user.refreshToken = refreshToken
    await user.save()

    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ New user registered: ${user.email}`)
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.getPublicProfile(),
        accessToken: token,
        refreshToken
      }
    })
  } catch (error) {
    console.error('Register Error:', error)
    next(error)
  }
}

// @desc    Login user
// @route   POST /user/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      })
    }

    const { email, password } = req.body

    // Find user with password
    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    }).select('+password')
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Generate new token
    const token = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    // Save new refresh token
    user.refreshToken = refreshToken
    await user.save()

    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ User logged in: ${user.email}`)
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
        accessToken: token,
        refreshToken
      }
    })
  } catch (error) {
    console.error('Login Error:', error)
    next(error)
  }
}


// @desc    Refresh access token
// @route   POST /user/refresh
// @access  Public
export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      })
    }

    // Verify refresh token
    let decoded
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      })
    }

    // check token type
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      })
    }

    // find user with refresh token 
    const user = await User.findById(decoded.id).select('+refreshToken')

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      })
    }

    // Generate new access token
    const newAccessToken = generateToken(user._id)

    // Optionally generate new refresh token
    const newRefreshToken = generateRefreshToken(user._id)
    user.refreshToken = newRefreshToken
    await user.save()


    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Access token refreshed for user: ${user.email}`)
    }

    return res.status(200).json({
      success: true,
      message: 'Access token refreshed successfully',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    })
  } catch (error) {
    console.error('Refresh Token Error:', error)
    next(error)
  }
}


// @desc    Logout user
// @route   POST /user/logout
// @access  Private
export const logoutUser = async (req, res, next) => {
  try {
    const userId = req.user.id

    // Remove refresh token from database
    await User.findByIdAndUpdate(userId, { refreshToken: null })

    if (process.env.NODE_ENV === 'development') {
      console.log(`👋 User logged out: ${req.user.email}`)
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    console.error('Logout Error:', error)
    next(error)
  }
}


// @desc    Get user profile
// @route   GET /user/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    })
  } catch (error) {
    console.error('Get Profile Error:', error)
    next(error)
  }
}