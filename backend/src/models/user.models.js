import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    required: true,
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  permissions: {
    canCreateQuiz: { type: Boolean, default: false },
    canPublishQuiz: { type: Boolean, default: false }
  },
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  refreshToken: { type: String },
  isActive: { type: Boolean, default: true }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.log(error);
    
  }
};

// JWT Token generation method (Access Token)
userSchema.methods.generateAuthToken = function () {
  const payload = {
    userId: this._id,
    fullName: this.fullName,
    email: this.email,
    role: this.role,
  };
  
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY});
  return token;
};

// Refresh Token generation method
userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    { userId: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY }  // Refresh token validity (30 days)
  );
  
  // Store the refresh token in the database for later invalidation
  this.refreshToken = refreshToken;  // Store a single refresh token (not an array)
  this.save();
  
  return refreshToken;
};

// Revoke refresh token method (to invalidate the refresh token)
userSchema.methods.revokeRefreshToken = function () {
  this.refreshToken = null;  // Invalidate the current refresh token
  this.save();
};

export const User = mongoose.model('User', userSchema);