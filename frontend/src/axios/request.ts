import axios from 'axios';
import { ENV } from '@/common/config';

const request = axios.create({
  baseURL: ENV.api.baseUrl,
  timeout: ENV.api.timeoutMs,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default request;
