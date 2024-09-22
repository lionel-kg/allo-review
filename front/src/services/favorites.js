import {apiBdd} from '@/config/axios';

export const fetchFavorites = async userId => {
  try {
    const response = await apiBdd.get(`/user/${userId}/likes`);
    return response.data;
  } catch (e) {
    console.error(e);
  }
};
