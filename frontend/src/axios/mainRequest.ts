import axios from 'axios';
import { ENV } from '@/common/config';

/**
 * Axios instance for the `main-service` (port 4000 by default, prefix `/api`).
 * Used by transactional modules such as Purchase Request that live in
 * `backend/main-service/`.
 *
 * The auth interceptor (see `Interceptor.tsx`) attaches the JWT to this
 * instance the same way it does for the back-service `request` instance.
 */
const mainRequest = axios.create({
  baseURL: ENV.api.mainBaseUrl,
  timeout: ENV.api.timeoutMs,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default mainRequest;
