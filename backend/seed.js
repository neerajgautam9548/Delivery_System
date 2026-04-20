const mongoose = require('mongoose');
require('dotenv').config();
const Content = require('./models/Content');
const User = require('./models/User');

const seedDatabase = async () => {
  try {
    // Only connect if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected for seeding');
    }

    await Content.deleteMany();
    await User.deleteMany();
    console.log('Cleared existing data.');

    const sampleContent = [
      {
        title: 'Action Sequence',
        description: 'A thrilling action sequence demonstration (Video)',
        type: 'video',
        mediaUrls: {
          low: 'http://localhost:5000/media/low.mp4',
          medium: 'http://localhost:5000/media/medium.mp4',
          high: 'http://localhost:5000/media/high.mp4'
        }
      },
      {
        title: 'Nature Photography',
        description: 'High fidelity natural landscape (Image)',
        type: 'image',
        mediaUrls: {
          low: 'http://localhost:5000/media/low.webp',
          medium: 'http://localhost:5000/media/medium.webp',
          high: 'http://localhost:5000/media/high.webp'
        }
      }
    ];

    await Content.insertMany(sampleContent);
    console.log('Sample content inserted.');

    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
