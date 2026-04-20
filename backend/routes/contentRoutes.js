const express = require('express');
const { getAdaptedContent } = require('../controllers/contentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Making auth middleware optional by wrapping it manually or just let it pass if token is missing
// Wait, for getting content we want guest users to also access it, but if they have a token, we parse preference.
const optionalProtect = (req, res, next) => {
  const jwt = require('jsonwebtoken');
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = decoded;
    } catch (error) {
      console.error('Invalid token, processing as guest');
    }
  }
  next();
};

router.get('/', optionalProtect, getAdaptedContent);
router.get('/adaptive', optionalProtect, getAdaptedContent);

module.exports = router;
