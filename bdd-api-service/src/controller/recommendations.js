const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const {apiIa} = require('../config/axios');
const movieHelper = require('../helpers/movieV2');

const generateRecommendationName = filters => {
  const genres = filters.genres?.length
    ? `Genres: ${filters.genres.join(', ')}`
    : '';
  const platforms = filters.platforms?.length
    ? `Plateformes: ${filters.platforms.join(', ')}`
    : '';

  return (
    [genres, platforms].filter(Boolean).join(' | ') ||
    'Liste de recommandations'
  );
};

const addRecommendationsList = async (req, res) => {
  try {
    const {filters} = req.body;
    const userId = req.userToken.id;
    let userReviews = [];
    let userLikes = [];
    const userData = await prisma.user.findUnique({
      where: {id: userId},
      include: {
        reviews: {
          include: {
            movie: true, // Inclure les détails du film pour chaque review
          },
        },
        likes: true, // Inclure les films likés
      },
    });

    // Extraire les reviews et les likes de l'objet userData
    if (filters.withReviews) {
      userReviews = userData.reviews;
    }
    if (filters.withLikes) {
      userLikes = userData.likes;
    }

    console.log('userReviews', userReviews);
    console.log('userLikes', userLikes);

    const recommendedMovies = await apiIa.post('/recommendations', {
      filters,
      userReviews,
      userLikes,
    });

    // Récupération des appréciations une seule fois
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

    const addedMovies = await movieHelper.AddMoviesBatch(
      recommendedMovies.data,
      appreciations,
    );

    const recommandationName = generateRecommendationName(filters);

    const newRecommendationList = await prisma.recommendation.create({
      data: {
        userId,
        title: recommandationName,
        movies: {
          connect: addedMovies.map(movie => ({id: movie.id})),
        },
      },
      include: {
        movies: true,
      },
    });

    res.json({
      success: true,
      data: {
        listId: newRecommendationList.id,
        movies: newRecommendationList.movies.map(movie => movie.id),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de la liste de recommandations',
    });
    console.log('error', error);
  }
};

const getRecommendationsListById = async (req, res) => {
  const {id} = req.params;
  if (!id) {
    return res.status(400).json({message: 'Invalid request.'});
  }

  try {
    const recommendationList = await prisma.recommendation.findUnique({
      where: {id: parseInt(id)},
      include: {
        movies: true,
      },
    });

    res.status(201).json(recommendationList);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de la liste de recommandations',
    });
    console.log('error', error);
  }
};

const getUserRecommendations = async (req, res) => {
  try {
    const userId = req.userToken.id;
    const recommendations = await prisma.recommendation.findMany({
      where: {
        userId: userId,
      },
      include: {
        movies: true,
      },
    });
    res.status(201).json(recommendations);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de la liste de recommandations',
    });
    console.log('error', error);
  }
};

module.exports = {
  addRecommendationsList,
  getRecommendationsListById,
  getUserRecommendations,
};
