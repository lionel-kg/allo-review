import axios from 'axios';
require('dotenv').config();

const createAxiosInstance = (baseURL, token = null, language = 'en-US') => {
  const instance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    params: {
      language: language,
    },
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
  process.env.API_KEY_TMDB,
);

export {apiTmdb};
