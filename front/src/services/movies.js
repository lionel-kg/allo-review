import {apiBdd} from '@/config/axios';

export const SearchMovies = async searchTerm => {
  try {
    const movies = await apiBdd.get('/movie/search', {
      params: {
        query: searchTerm,
      },
    });
    return movies;
  } catch (e) {
    console.error(e);
  }
};

export const addNewMovie = async movie => {
  try {
    const movies = await apiBdd.post('/movie', movie);
    return movies;
  } catch (e) {
    console.error(e);
  }
};
