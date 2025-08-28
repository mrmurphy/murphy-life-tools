import { format, parseISO, isToday, isYesterday } from 'date-fns';

/**
 * Format a date for display
 * @param {string|Date} date - The date to format
 * @param {string} formatString - The format string (default: 'MM/dd/yyyy')
 * @returns {string} Formatted date string
 */
export function formatDate(date, formatString = 'MM/dd/yyyy') {
  return format(new Date(date), formatString);
}

/**
 * Parse an ISO date string to a Date object
 * @param {string} isoString - The ISO date string
 * @returns {Date} Parsed Date object
 */
export function parseIsoDate(isoString) {
  return parseISO(isoString);
}

/**
 * Check if a date is today
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if the date is today
 */
export function isDateToday(date) {
  return isToday(new Date(date));
}

/**
 * Check if a date is yesterday
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if the date is yesterday
 */
export function isDateYesterday(date) {
  return isYesterday(new Date(date));
}

/**
 * Get relative date string (Today, Yesterday, or formatted date)
 * @param {string|Date} date - The date to format
 * @returns {string} Relative date string
 */
export function getRelativeDate(date) {
  if (isDateToday(date)) {
    return 'Today';
  }
  if (isDateYesterday(date)) {
    return 'Yesterday';
  }
  return formatDate(date);
}