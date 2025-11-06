/**
 * Calculate parking cost based on duration and space type
 * @param {Date} startTime - Start time of parking
 * @param {Date} endTime - End time of parking
 * @param {number} hourlyRate - Hourly rate for the parking space
 * @returns {number} - Calculated parking cost
 */
const calculateParkingCost = (startTime, endTime, hourlyRate) => {
  // Calculate duration in hours
  const durationMs = new Date(endTime) - new Date(startTime);
  const durationHours = durationMs / (1000 * 60 * 60);
  
  // Calculate cost
  const cost = durationHours * hourlyRate;
  
  // Round to 2 decimal places
  return Math.round(cost * 100) / 100;
};

/**
 * Calculate duration in hours between two dates
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @returns {number} - Duration in hours
 */
const calculateDuration = (startTime, endTime) => {
  const durationMs = new Date(endTime) - new Date(startTime);
  return durationMs / (1000 * 60 * 60);
};

module.exports = {
  calculateParkingCost,
  calculateDuration
};