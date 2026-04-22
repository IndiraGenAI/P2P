import { ENV } from '@/common/config';

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
