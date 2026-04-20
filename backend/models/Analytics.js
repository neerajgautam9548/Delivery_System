const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['video', 'image'],
    required: true
  },
  quality: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analytics', analyticsSchema);
