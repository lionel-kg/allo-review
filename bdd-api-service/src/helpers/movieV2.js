const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const {apiTmdb, apiIa} = require('../config/axios');

const FindClosestCategory = async (score, magnitude, appreciations) => {
  let minDistance = Infinity;
  let closestCategory = null;

  for (const category of appreciations) {
    const scoreDistance = Math.min(
      Math.abs(score - category.min_score),
      Math.abs(score - category.max_score),
    );
    const magnitudeDistance = Math.min(
      Math.abs(magnitude - category.min_magnitude),
      Math.abs(magnitude - category.max_magnitude),
    );

    const totalDistance = scoreDistance + magnitudeDistance;

    if (totalDistance < minDistance) {
      minDistance = totalDistance;
      closestCategory = category;
    }
  }
  return closestCategory;
};

const GetAppreciation = async ({score, magnitude, appreciations}) => {
  const matchingAppreciation = await appreciations.find(
    appreciation =>
      score >= appreciation.min_score &&
      score <= appreciation.max_score &&
      magnitude >= appreciation.min_magnitude &&
      magnitude <= appreciation.max_magnitude,
  );

  if (!matchingAppreciation) {
    return await FindClosestCategory(score, magnitude, appreciations);
  }
  return matchingAppreciation;
};

const AddReviews = async (movie, appreciations, reviews) => {
  const reviewPromises = reviews.map(async review => {
    try {
      console.time(`Sentiment Analysis for review ${review.id}`);
      const analyseReview = (
        await apiIa.post(`/naturalLanguage/analyze-sentiment`, {
          content: review.content,
        })
      )?.data;
      console.timeEnd(`Sentiment Analysis for review ${review.id}`);

      const appreciation = await GetAppreciation({
        score: analyseReview?.score || 0,
        magnitude: analyseReview?.magnitude || 0,
        appreciations,
      });

      const newReview = {
        author_name: review.author ?? review.author_name,
        content: review.content,
        appreciation: {connect: {id: appreciation.id}},
        created_at: new Date(review.created_at || Date.now()),
        updated_at: new Date(review.updated_at || Date.now()),
        movie: {connect: {id: movie.id}},
        review_score: analyseReview?.score,
        review_magnitude: analyseReview?.magnitude,
      };

      if (review.userId) {
        newReview['author'] = {connect: {id: review.userId}};
      }

      console.time(`Create review in DB for movie ${movie.title}`);
      const addedReview = await prisma.review.create({
        data: newReview,
      });
      console.timeEnd(`Create review in DB for movie ${movie.title}`);

      return addedReview;
    } catch (innerReviewError) {
      console.error(
        `Error processing review ${review.id} for movie ${movie.title}: ${innerReviewError.message}`,
      );
    }
  });

  const addedReviews = await Promise.all(reviewPromises); // Parallélisation
  return addedReviews;
};

const AddMovie = async (movie, appreciations) => {
  const movieExists = await prisma.movie.findUnique({
    where: {tmdb_id: movie.id},
  });

  if (!movieExists) {
    try {
      console.time(`TMDB API calls for movie ${movie.title}`);
      const videos = (await apiTmdb.get(`/movie/${movie.id}/videos`))?.data
        ?.results;
      const trailer = videos.find(
        video => video.type === 'Trailer' && video.site === 'YouTube',
      );

      const genres = await prisma.genre.findMany({
        where: {
          tmdb_id: {in: movie.genre_ids},
        },
      });

      const newMovie = {
        tmdb_id: movie.id,
        title: movie.title,
        overview: movie.overview,
        images: JSON.stringify([
          {name: 'poster', path: movie.poster_path},
          {name: 'backdrop', path: movie.backdrop_path},
        ]),
        genres: {
          connect: genres.map(genre => ({id: genre.id})),
        },
        trailer: trailer?.key,
        original_language: movie.original_language,
        release_date: new Date(movie.release_date),
      };

      let movieAdded = await prisma.movie.create({
        data: newMovie,
        include: {
          reviews: true,
          genres: true,
          categories: true,
          appreciation: true,
        },
      });

      if (movieAdded) {
        console.log(
          `Movie added name: ${movieAdded.title} (ID: ${movieAdded.id})`,
        );

        const response = (
          await apiTmdb.get(`/movie/${movieAdded.tmdb_id}/reviews`)
        )?.data?.results;

        if (response) {
          let totalScore = 0;
          let totalMagnitude = 0;

          const addedReviews = await AddReviews(
            movieAdded,
            appreciations,
            response,
          );

          addedReviews.forEach(review => {
            totalScore += review.review_score;
            totalMagnitude += review.review_magnitude;
          });

          if (totalScore && totalMagnitude) {
            const globalAppreciation = await GetAppreciation({
              score: totalScore,
              magnitude: totalMagnitude,
              appreciations,
            });

            try {
              movieAdded = await prisma.movie.update({
                where: {
                  id: movieAdded.id,
                },
                data: {appreciation: {connect: {id: globalAppreciation.id}}},
                include: {
                  reviews: true,
                  genres: true,
                  categories: true,
                  appreciation: true,
                },
              });
            } catch (innerMovieError) {
              console.error(
                `Error processing global appreciation add to movie ${movie.id}: ${innerMovieError.message}`,
              );
            }
          }
        }

        return movieAdded;
      }
    } catch (innerMovieError) {
      console.error(
        `Error processing movie ${movie.id}: ${innerMovieError.message}.`,
      );
    }
  } else {
    console.log(
      `Movie already exists: ${movieExists.title} (ID: ${movieExists.id})`,
    );

    return movieExists;
  }
};

const AddMoviesBatch = async (movies, appreciations) => {
  const moviePromises = movies.map(async movie => {
    try {
      return await AddMovie(movie, appreciations);
    } catch (error) {
      console.error(`Error adding movie ${movie.title}:`, error);
      return null;
    }
  });

  const addedMovies = await Promise.all(moviePromises);
  return addedMovies.filter(movie => movie !== null);
};

module.exports = {GetAppreciation, AddReviews, AddMovie, AddMoviesBatch};
