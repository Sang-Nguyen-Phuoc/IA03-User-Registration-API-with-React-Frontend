import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email'
      ],
      index: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw new Error('Password comparison failed')
  }
}

// Get public profile
userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    email: this.email,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  }
}

// Remove password from JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

// Find by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase().trim() })
}

const User = mongoose.model('User', userSchema)

export default User