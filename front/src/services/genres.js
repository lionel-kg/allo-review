import {apiBdd} from '@/config/axios';

export const getGenres = async () => {
  try {
    const response = await apiBdd.get('/genre');
    return response.data;
  } catch (e) {
    console.error(e);
  }
};
