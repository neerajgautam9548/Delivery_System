/**
 * Determines the ideal content quality based on device, network, and user preference.
 *
 * @param {string} device - 'mobile', 'tablet', or 'desktop'
 * @param {string} networkSpeed - 'slow', 'medium', or 'fast'
 * @param {string} userPreference - 'auto', 'low', 'medium', or 'high'
 * @returns {string} - 'low', 'medium', or 'high'
 */
const getContentQuality = (device, networkSpeed, userPreference = 'auto') => {
  // User preference overrides auto detection
  if (userPreference !== 'auto') {
    return userPreference;
  }

  // Mobile rules
  if (device === 'mobile') {
    if (networkSpeed === 'slow') return 'low';
    if (networkSpeed === 'medium') return 'low';
    return 'medium'; // Fast mobile gets medium quality to save bandwidth while still looking good
  }

  // Tablet rules
  if (device === 'tablet') {
    if (networkSpeed === 'slow') return 'low';
    if (networkSpeed === 'medium') return 'medium';
    return 'high'; // Fast tablet gets high
  }

  // Desktop rules
  if (device === 'desktop') {
    if (networkSpeed === 'slow') return 'medium'; // Desktop still needs some fidelity, fallback to medium
    return 'high'; // Medium or Fast on desktop gets high
  }

  // Default fallback
  return 'medium';
};

module.exports = {
  getContentQuality
};
