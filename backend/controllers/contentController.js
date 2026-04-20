const Content = require('../models/Content');
const { getContentQuality } = require('../services/AdaptiveService');
const User = require('../models/User');

const getAdaptedContent = async (req, res) => {
  try {
    const { device = 'desktop', network = 'fast' } = req.query;
    let userPreference = 'auto';

    // If user is authenticated, fetch their preference, otherwise default to auto
    if (req.user) {
      const user = await User.findById(req.user.id);
      if (user) {
        userPreference = user.preferences.quality;
      }
    }

    // Determine target quality
    const targetQuality = getContentQuality(device, network, userPreference);

    // Fetch all content
    const contents = await Content.find();

    // Map contents to return only the URL for the selected quality
    const adaptedContents = contents.map(content => {
      return {
        _id: content._id,
        title: content.title,
        description: content.description,
        type: content.type,
        quality: targetQuality,
        mediaUrl: content.mediaUrls[targetQuality] // Extract only the specific quality URL
      };
    });

    res.json({
      meta: {
        detectedDevice: device,
        detectedNetwork: network,
        userPreference: userPreference,
        appliedQuality: targetQuality,
      },
      data: adaptedContents
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching content' });
  }
};

module.exports = {
  getAdaptedContent
};
