const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const {apiTmdb} = require('../config/axios');

const movieHelper = require('../helpers/movie');

const search = async (req, res) => {
  const {query} = req.query;

  if (!query || query.length < 3) {
    return res.status(400).json({message: 'Invalid query.'});
  }

  let movies = await prisma.movie.findMany({
    where: {
      title: {
        contains: query,
        mode: 'insensitive',
      },
    },
    include: {
      genres: true,
      reviews: true,
      categories: true,
      appreciation: true,
    },
    take: 10,
  });

  movies = movies.map(movie => ({
    ...movie,
    images: JSON.parse(movie.images || '[]'),
  }));

  if (movies.length >= 1) {
    return res.json(movies);
  }

  try {
    const response = await apiTmdb.get(`/search/movie`, {
      params: {
        query: query,
      },
    });

    if (response && response.data && response.data.results) {
      movies = [...movies, ...response.data.results];

      return res.json(movies.slice(0, 10));
    }
  } catch (error) {
    console.error('TMDB API error:', error);
    return res.status(500).json({message: 'Failed to fetch from TMDB.'});
  }
};

const addMovie = async (req, res) => {
  const appreciations = await prisma.appreciation.findMany({
    select: {
      id: true,
      title: true,
      min_score: true,
      max_score: true,
      min_magnitude: true,
      max_magnitude: true,
    },
  });

  try {
    const movie = await movieHelper.AddMovie(req.body, appreciations);

    res.status(201).json(movie);
  } catch (error) {
    console.log(error);
    res.status(400).json({message: error.message});
  }
};

module.exports = {search, addMovie};
