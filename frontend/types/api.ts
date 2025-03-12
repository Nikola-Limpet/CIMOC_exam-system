/**
 * Generic API response format
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

/**
 * Paginated response format
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

/**
 * Error response format
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}
