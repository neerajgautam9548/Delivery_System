const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();


const mongoose = require('mongoose');

// Wait... connecting directly since the provided config/db might be old.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static files (for media)
app.use('/media', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.get('/', (req, res) => {
  res.send('Adaptive Content API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});