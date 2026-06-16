// hooks/useApi.ts
import { useState, useCallback } from 'react';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://api.surya-education.com/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async <T>(
      method: 'GET' | 'POST' | 'PUT' | 'DELETE',
      url: string,
      data?: any,
      options?: UseApiOptions
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.request<T>({
          method,
          url,
          data,
        });
        options?.onSuccess?.(response.data);
        return response.data;
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || 'Une erreur est survenue';
        setError(message);
        options?.onError?.(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const get = useCallback(<T>(url: string, options?: UseApiOptions) => {
    return request<T>('GET', url, undefined, options);
  }, [request]);

  const post = useCallback(<T>(url: string, data?: any, options?: UseApiOptions) => {
    return request<T>('POST', url, data, options);
  }, [request]);

  const put = useCallback(<T>(url: string, data?: any, options?: UseApiOptions) => {
    return request<T>('PUT', url, data, options);
  }, [request]);

  const del = useCallback(<T>(url: string, options?: UseApiOptions) => {
    return request<T>('DELETE', url, undefined, options);
  }, [request]);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
  };
};