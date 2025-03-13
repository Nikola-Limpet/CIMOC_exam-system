/**
 * Date utility functions for frontend
 */

/**
 * Format a date for display to users
 * @param dateString ISO date string
 * @param options Intl.DateTimeFormatOptions
 */
export function formatDisplayDate(
  dateString: string | undefined | null,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: 'medium',
    timeStyle: 'short',
  }
): string {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    return new Intl.DateTimeFormat(
      navigator.language || 'en-US',
      options
    ).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error formatting date';
  }
}

/**
 * Convert a local date to an ISO string for API submission
 * @param date JavaScript Date object
 */
export function toAPIDateFormat(date: Date | null): string | null {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

/**
 * Format a date range for display
 * @param startDate Start date string
 * @param endDate End date string
 */
export function formatDateRange(startDate?: string, endDate?: string): string {
  if (!startDate) return 'No date specified';

  const start = formatDisplayDate(startDate, { dateStyle: 'medium', timeStyle: 'short' });

  if (!endDate) return start;

  const end = formatDisplayDate(endDate, { dateStyle: 'medium', timeStyle: 'short' });
  return `${start} - ${end}`;
}
