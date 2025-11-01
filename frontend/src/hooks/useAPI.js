/**
 * Custom hook for API calls with error handling and loading states
 */
import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/config';
import { parseAPIError, logError, retryWithBackoff } from '../utils/errorHandler';

/**
 * Custom hook for making API calls
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Object} API call utilities
 */
export function useAPI(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    method = 'GET',
    retry = true,
    maxRetries = 3
  } = options;

  const execute = useCallback(async (params = {}, body = null) => {
    setLoading(true);
    setError(null);

    try {
      const requestFn = async () => {
        const config = {
          method,
          url: `${API_CONFIG.baseURL}${endpoint}`,
          timeout: API_CONFIG.timeout,
          ...options
        };

        if (params && Object.keys(params).length > 0) {
          config.params = params;
        }

        if (body) {
          config.data = body;
        }

        const response = await axios(config);
        return response.data;
      };

      let result;
      if (retry) {
        result = await retryWithBackoff(requestFn, maxRetries);
      } else {
        result = await requestFn();
      }

      setData(result);
      return result;
    } catch (err) {
      const errorMessage = parseAPIError(err);
      setError(errorMessage);
      logError(err, `API: ${endpoint}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, method, retry, maxRetries, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
}

/**
 * Hook for generating project ideas
 */
export function useGenerateIdea() {
  return useAPI('/api/idea');
}

/**
 * Hook for generating graphs
 */
export function useGenerateGraph() {
  return useAPI('/api/graph');
}

/**
 * Hook for generating reports
 */
export function useGenerateReport() {
  return useAPI('/api/report', { method: 'POST' });
}

/**
 * Hook for listing projects
 */
export function useListProjects() {
  return useAPI('/api/projects');
}

