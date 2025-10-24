/**
 * Centralized error handling utilities
 */

/**
 * Parse API error response
 * @param {Error} error - Error object from axios or fetch
 * @returns {string} User-friendly error message
 */
export function parseAPIError(error) {
  // Network error
  if (!error.response) {
    return 'Network error. Please check your connection and try again.';
  }

  const { status, data } = error.response;

  // Rate limiting
  if (status === 429) {
    const retryAfter = error.response.headers['retry-after'];
    return `Rate limit exceeded. Please try again${retryAfter ? ` in ${retryAfter} seconds` : ' later'}.`;
  }

  // Validation errors
  if (status === 400 || status === 422) {
    if (data.message) {
      return data.message;
    }
    if (data.detail) {
      return typeof data.detail === 'string' ? data.detail : 'Invalid input. Please check your data.';
    }
    return 'Invalid input. Please check your data and try again.';
  }

  // Authentication errors
  if (status === 401) {
    return 'Authentication required. Please sign in.';
  }

  // Authorization errors
  if (status === 403) {
    return 'You do not have permission to perform this action.';
  }

  // Not found
  if (status === 404) {
    return 'Resource not found.';
  }

  // Server errors
  if (status >= 500) {
    if (data.service === 'gemini' || data.service === 'openai') {
      return `AI service temporarily unavailable. ${data.message || 'Please try again.'}`;
    }
    return data.message || 'Server error. Please try again later.';
  }

  // Service unavailable (AI service errors)
  if (status === 503) {
    return data.message || 'AI service temporarily unavailable. Please try again.';
  }

  // Default error message
  return data.message || data.detail || 'An unexpected error occurred. Please try again.';
}

/**
 * Log error to console (can be extended to send to analytics)
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 */
export function logError(error, context = 'Unknown') {
  if (import.meta.env.DEV) {
    console.error(`Error in ${context}:`, error);
  }

  // TODO: Send to analytics service in production
  // if (import.meta.env.PROD) {
  //   sendToAnalytics(error, context);
  // }
}

/**
 * Show user-friendly error notification
 * @param {Error} error - Error object
 * @param {Function} setError - State setter for error display
 * @param {string} context - Context where error occurred
 */
export function handleError(error, setError, context = 'Unknown') {
  logError(error, context);
  const message = parseAPIError(error);
  setError(message);
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise} Result of the function
 */
export async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx) except rate limiting
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        if (error.response.status !== 429) {
          throw error;
        }
      }

      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
}

