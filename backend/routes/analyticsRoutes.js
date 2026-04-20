const express = require('express');
const { trackDownload } = require('../controllers/analyticsController');

const router = express.Router();

router.post('/download', trackDownload);

module.exports = router;
