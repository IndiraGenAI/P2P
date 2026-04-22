import { useEffect } from 'react';
import request from './request';

const describeStatus = (status: number): string => {
  if (status >= 500) return `Server error (${status})`;
  if (status === 401) return 'You are not authorised. Please sign in again.';
  if (status === 403) return 'You do not have permission to perform this action.';
  if (status === 404) return 'The requested resource was not found.';
  return `Request failed (${status})`;
};

/**
 * Lightweight axios interceptor.
 * - Attaches Authorization header from localStorage if a token is present.
 * - Normalises every failure into a usable Error message so the redux slices
 *   (and downstream toast effects) always have something human-readable to
 *   show, no matter the failure mode (network/4xx/5xx/empty-body).
 *
 * The interceptor itself never renders UI - toasts are owned by the page
 * components, which subscribe to their slice messages.
 */
const Interceptor = () => {
  useEffect(() => {
    const reqId = request.interceptors.request.use(
      (config) => {
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('accessToken')
            : null;
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        if (config.headers && config.headers['no-auth']) {
          delete config.headers['no-auth'];
          delete config.headers['Authorization'];
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const resId = request.interceptors.response.use(
      (response) => response,
      (error) => {
        const response = error?.response;

        if (!response) {
          return Promise.reject(
            new Error(
              'Network error – unable to reach the server. Please check your connection.',
            ),
          );
        }

        const raw = response?.data?.message;
        const text = Array.isArray(raw) ? raw.join(' ') : raw;
        const fallbackByStatus = describeStatus(response.status);

        return Promise.reject(new Error(text || fallbackByStatus));
      },
    );

    return () => {
      request.interceptors.request.eject(reqId);
      request.interceptors.response.eject(resId);
    };
  }, []);

  return null;
};

export default Interceptor;
