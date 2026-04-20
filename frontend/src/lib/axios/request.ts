import axios from 'axios';

const request = axios.create({
  // baseURL: config.baseApi , // url = base url + request url
  timeout: 1 * 60 * 1000, // 1 minute
  headers: {
    Accept: 'application/json',
  },
});

export default request;