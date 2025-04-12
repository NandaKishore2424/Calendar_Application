/**
 * Date utility functions for the Calendar application
 */

/**
 * Format a date to YYYY-MM-DD format (for API requests)
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatYYYYMMDD = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Format a date to display format (e.g., "Monday, April 12")
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDisplayDate = (date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format a time (e.g., "9:00 AM")
 * @param {Date} date - The date with time to format
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Format time range (e.g., "9:00 AM - 10:00 AM")
 * @param {Date} start - Start time
 * @param {Date} end - End time
 * @returns {string} Formatted time range
 */
export const formatTimeRange = (start, end) => {
  return `${formatTime(start)} - ${formatTime(end)}`;
};

/**
 * Generate array of time slots for the calendar (default 15-minute intervals)
 * @param {number} intervalMinutes - Interval in minutes (default: 15)
 * @param {number} startHour - Start hour (default: 0 = midnight)
 * @param {number} endHour - End hour (default: 24 = midnight)
 * @returns {Array} Array of time slot objects
 */
export const generateTimeSlots = (intervalMinutes = 15, startHour = 0, endHour = 24) => {
  const slots = [];
  const totalMinutesInDay = (endHour - startHour) * 60;
  const totalSlots = totalMinutesInDay / intervalMinutes;
  
  for (let i = 0; i < totalSlots; i++) {
    const minutes = i * intervalMinutes + (startHour * 60);
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    
    slots.push({
      time: date,
      label: formatTime(date),
      value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    });
  }
  
  return slots;
};

/**
 * Get the position in pixels for a time in the calendar grid
 * @param {Date} time - The time to convert
 * @param {number} hourHeight - Height of one hour in pixels
 * @returns {number} Position in pixels from the top
 */
export const getTimePosition = (time, hourHeight = 60) => {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  return (hours + minutes / 60) * hourHeight;
};

/**
 * Calculate the height in pixels for an event based on its duration
 * @param {Date} start - Start time
 * @param {Date} end - End time
 * @param {number} hourHeight - Height of one hour in pixels
 * @returns {number} Height in pixels
 */
export const getEventHeight = (start, end, hourHeight = 60) => {
  const durationHours = (end - start) / (1000 * 60 * 60);
  return durationHours * hourHeight;
};

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if dates are the same day
 */
export const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Move to the next day
 * @param {Date} date - Current date
 * @returns {Date} Next day
 */
export const getNextDay = (date) => {
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  return nextDay;
};

/**
 * Move to the previous day
 * @param {Date} date - Current date
 * @returns {Date} Previous day
 */
export const getPreviousDay = (date) => {
  const prevDay = new Date(date);
  prevDay.setDate(date.getDate() - 1);
  return prevDay;
};

/**
 * Parse a time string (HH:MM) to a Date object
 * @param {string} timeString - Time string in HH:MM format
 * @param {Date} baseDate - Base date to use (defaults to today)
 * @returns {Date} Date object with the specified time
 */
export const parseTimeString = (timeString, baseDate = new Date()) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

/**
 * Round a date to the nearest interval (for grid snapping)
 * @param {Date} date - Date to round
 * @param {number} intervalMinutes - Interval in minutes
 * @returns {Date} Rounded date
 */
export const roundToNearestInterval = (date, intervalMinutes = 15) => {
  const roundedDate = new Date(date);
  const minutes = date.getMinutes();
  const remainder = minutes % intervalMinutes;
  
  if (remainder < intervalMinutes / 2) {
    // Round down
    roundedDate.setMinutes(minutes - remainder);
  } else {
    // Round up
    roundedDate.setMinutes(minutes + (intervalMinutes - remainder));
  }
  
  roundedDate.setSeconds(0, 0);
  return roundedDate;
};