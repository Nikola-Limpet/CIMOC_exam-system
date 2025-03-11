import { formatDistanceToNow, format, isPast, isFuture } from 'date-fns';
import { CheckCircle2, FileEdit, XCircle } from 'lucide-react';

// Status badge styles with enhanced visual treatment
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30';
    case 'draft':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30';
    case 'archived':
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/30';
    default:
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30';
  }
};

// Get status icon for better visual cues
export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'published':
      return <CheckCircle2 className="h-3 w-3 mr-1" />; // Fixed missing closing angle bracket
    case 'draft':
      return <FileEdit className="h-3 w-3 mr-1" />;
    case 'archived':
      return <XCircle className="h-3 w-3 mr-1" />;
    default:
      return null;
  }
};

// Determine exam availability status and color
export const getAvailabilityInfo = (availableFrom?: string, availableTo?: string) => {
  // Return a default display if dates aren't available
  if (!availableFrom || !availableTo) {
    return {
      text: 'No schedule information',
      color: 'text-muted-foreground',
    };
  }

  const now = new Date();
  const startDate = new Date(availableFrom);
  const endDate = new Date(availableTo);

  if (isFuture(startDate)) {
    return {
      text: `Opens ${formatDistanceToNow(startDate, { addSuffix: true })}`,
      color: 'text-yellow-600 dark:text-yellow-400',
    };
  } else if (isPast(endDate)) {
    return {
      text: `Closed ${formatDistanceToNow(endDate, { addSuffix: true })}`,
      color: 'text-red-600 dark:text-red-400',
    };
  } else {
    return {
      text: `Available until ${format(endDate, 'MMM d, yyyy')}`,
      color: 'text-green-600 dark:text-green-400',
    };
  }
};

export const getStatusBackground = (status?: string) => {
  switch (status) {
    case 'published':
      return 'linear-gradient(to right, #3b82f6, #8b5cf6)';
    case 'draft':
      return 'linear-gradient(to right, #f59e0b, #d97706)';
    default:
      return 'linear-gradient(to right, #6b7280, #4b5563)';
  }
};
