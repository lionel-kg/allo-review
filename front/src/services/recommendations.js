import {apiBdd} from '@/config/axios';

export const addRecommendationsList = async body => {
  try {
    const response = await apiBdd.post('/recommendations', body);
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

export const fetchRecommendationsList = async id => {
  try {
    const response = await apiBdd.get(`/recommendations/${id}`);
    console.log('response', response);
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

export const fetchRecommendations = async id => {
  try {
    const response = await apiBdd.get(`/recommendations/user/${id}`);
    return response.data;
  } catch (e) {
    console.error(e);
  }
};
