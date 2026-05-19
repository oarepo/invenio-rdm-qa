/**
 * This file contains utility functions for working with dates, returning dates in the YYYY-MM-DD format suitable for testing.
 * 
 * Includes:
 * - getDatePlusOne: Returns tomorrow's date (today + 1 day)
 * - getTodayDate: Returns today's date
 * 
 * Usage:
 * Import these functions in tests where dynamic retrieval of the current date or the next day's date in the correct format is needed.
 */

export const getDatePlusOne = (): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};