const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  mediaUrls: {
    low: {
      type: String, // e.g. low resolution image or video
      required: true
    },
    medium: {
      type: String,
      required: true
    },
    high: {
      type: String,
      required: true
    }
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  }
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
