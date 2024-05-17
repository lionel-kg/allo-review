import {apiTmdb} from '../config/axios';
const language = require('@google-cloud/language');

async function analyzeSentiment(reviews) {
  const client = new language.LanguageServiceClient();
  try {
    let totalScore = 0;
    let totalMagnitude = 0;
    let result = [];
    for (const review of reviews) {
      const document = {
        content: review.content,
        type: 'PLAIN_TEXT',
      };

      const analyse = await client.analyzeSentiment({document});

      result.push(analyse);

      totalScore += analyse.documentSentiment.score;
      totalMagnitude += analyse.documentSentiment.magnitude;
    }

    const averageScore = totalScore / reviews.length;
    const averageMagnitude = totalMagnitude / reviews.length;

    return {averageScore, averageMagnitude, result};
  } catch (err) {
    console.error('ERROR:', err);
    throw err;
  }
}

const fetchMovieReviews = async (req, res) => {
  try {
    const response = await apiTmdb.request(
      `movie/${req.query.movieId}/reviews`,
    );

    const test = analyzeSentiment(response.data.results);

    res.json(test);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

const fetchMoviePopular = async (req, res) => {
  try {
    const response = await apiTmdb.request('movie/popular');

    res.json(response.data.results);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

const fetchNowPlaying = async (req, res) => {
  try {
    const response = await apiTmdb.request('movie/now_playing');

    res.json(response.data.results);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

const fetchMovieTopRated = async (req, res) => {
  try {
    const response = await apiTmdb.request('movie/top_rated');

    res.json(response.data.results);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

const fetchUpcoming = async (req, res) => {
  try {
    const response = await apiTmdb.request('movie/upcoming');

    res.json(response.data.results);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

const searchInAll = async (req, res) => {
  try {
    const response = await apiTmdb.request('search/multi', {
      params: {query: req.query?.query},
    });

    res.json(response?.data?.results);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export default {
  fetchMovieReviews,
  fetchNowPlaying,
  fetchMoviePopular,
  fetchMovieTopRated,
  fetchUpcoming,
  searchInAll,
};
