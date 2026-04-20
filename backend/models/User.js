const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  preferences: {
    quality: {
      type: String,
      enum: ['auto', 'low', 'medium', 'high'],
      default: 'auto'
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
