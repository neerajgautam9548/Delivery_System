const Analytics = require('../models/Analytics');

exports.trackDownload = async (req, res) => {
  try {
    const { type, quality } = req.body;
    
    if (!['video', 'image'].includes(type) || !['low', 'medium', 'high'].includes(quality)) {
      return res.status(400).json({ success: false, message: 'Invalid type or quality' });
    }

    const downloadRecord = await Analytics.create({
      type,
      quality
    });

    res.status(201).json({
      success: true,
      data: downloadRecord
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
