import axios from 'axios';
import Cookies from 'js-cookie';

const createAxiosInstance = (baseURL, headers = null, params = null) => {
  const instance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers,
    params,
  });

  instance.interceptors.request.use(
    config => {
      const token = Cookies.get('jwt') ?? localStorage.getItem('token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response) {
        const errorMessage = error.response.data.error || 'An error occurred';
      }
      return Promise.reject(error);
    },
  );

  return instance;
};
const apiBdd = createAxiosInstance(process.env.BDD_API_BASE_URL);

const apiAuth = createAxiosInstance(process.env.AUTH_API_BASE_URL);

const apiNotif = createAxiosInstance(process.env.MAIL_SMS_BASE_API_URL);

const apiStripe = createAxiosInstance(process.env.STRIPE_API_BASE_URL);

export {apiBdd, apiAuth, apiNotif, apiStripe};
