import {apiTmdb} from '../config/axios';
import {generate, checkAvailabilityOnTMDb} from '../helpers/recommendations';

const generateRecommendations = async (req, res) => {
  const {userReviews, userLikes} = req.body;
  const {genres, platforms} = req.body.filters;
  console.log('req.body', req.body);
  try {
    const recommendedMovies = await generate(
      genres,
      platforms,
      userReviews,
      userLikes,
    );

    const tmdbMovies = [];
    for (const movie of recommendedMovies) {
      try {
        const response = await apiTmdb.request(`search/movie`, {
          params: {query: movie.title},
        });

        if (response.data.results.length > 0) {
          const tmdbMovie = response.data.results[0];

          const movieWithAvailability = {
            ...tmdbMovie,
            isAvailable: await checkAvailabilityOnTMDb(tmdbMovie.id, platforms),
          };

          tmdbMovies.push(movieWithAvailability);
        }
      } catch (error) {
        console.error(
          `Erreur lors de la recherche du film ${movie.title} sur TMDB:`,
          error,
        );
      }
    }

    res.json(tmdbMovies);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  generateRecommendations,
};
