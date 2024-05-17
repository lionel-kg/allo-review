const axios = require('axios');
require('dotenv').config();

const createAxiosInstance = (baseURL, headers = null, params = null) => {
  const instance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers,
    params,
  });

  instance.interceptors.request.use(
    config => {
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

const apiTmdb = createAxiosInstance(
  process.env.API_TMDB,
  {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.API_KEY_TMDB}`,
  },
  {
    params: {
      language: 'en-US',
    },
  },
);

const apiIa = createAxiosInstance(process.env.API_IA_URL);

module.exports = {apiTmdb, apiIa};
