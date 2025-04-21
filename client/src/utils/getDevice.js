// utils/getDevice.js

/**
 * Gets or creates a device ID that can be used across the application
 * @returns {string} The device ID
 */
export const getDeviceId = () => {
  // Get existing ID from localStorage or generate a new one
  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    // Create a unique identifier by combining various device properties with a timestamp
    const randomId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    deviceId = `${navigator.platform}-${randomId}-${Date.now()}`;
    localStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
};

/**
 * Gets full device information including ID, user agent, platform and timestamp
 * @returns {Object} Device information object
 */
export const getDeviceInfo = () => {
  return {
    deviceId: getDeviceId(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    lastUsed: new Date(),
    isActive: true,
  };
};
