import { ENV } from '@/common/config';

/**
 * Legacy config object retained for compatibility with services that import
 * `baseApiAuth`, `baseApiMasters`, etc. All endpoints currently resolve to
 * the single backend service URL configured via VITE_API_BASE_URL.
 */
const config = {
  baseApiMasters: ENV.api.baseUrl,
  baseApiExpense: ENV.api.baseUrl,
  baseApiAuth: ENV.api.baseUrl,
  baseApiAdmission: ENV.api.baseUrl,
  baseApiIncome: ENV.api.baseUrl,
  baseApiStudent: ENV.api.baseUrl,
  baseApiApplication: ENV.api.baseUrl,
  baseApiBatch: ENV.api.baseUrl,
  mode: ENV.isDev ? 'development' : 'production',
};

export default config;
