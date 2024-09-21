const express = require('express');
const router = express.Router();
const prisma = require('../config/db.js');
const movie = require('../controller/movie.js');
const verifyToken = require('../middleware/verifyToken.js');
const paywall = require('../middleware/paywall.js');
// POST /movies - Create a new movie
router.post('/', movie.addMovie);

router.get('/search', movie.search);

// GET /movies - Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await prisma.movie.findMany();
    res.json(movies);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// GET /movies/:id - Get a single movie by id
router.get('/:id', async (req, res) => {
  const {id} = req.params;

  try {
    const movie = await prisma.movie.findUnique({
      where: {id: parseInt(id)},
      include: {
        reviews: {
          include: {
            appreciation: true,
          },
        },
        genres: true,
        categories: true,
        appreciation: true,
      },
    });
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({message: 'Movie not found'});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({message: error.message});
  }
});

// PUT /movies/:id - Update a movie
router.put('/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const movie = await prisma.movie.update({
      where: {id: parseInt(id)},
      data: req.body,
    });
    res.json(movie);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// DELETE /movies/:id - Delete a movie
router.delete('/:id', async (req, res) => {
  const {id} = req.params;
  try {
    await prisma.movie.delete({
      where: {id: parseInt(id)},
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

router.post('/:id/add-like', verifyToken, async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log('userId: ' + userId);
    const movieId = parseInt(req.params.id);
    // Vérifiez si le like existe déjà en vérifiant dans la relation implicite.
    const existingLike = await prisma.movie.findMany({
      where: {
        AND: [
          {
            id: movieId,
          },
          {
            likedBy: {
              some: {
                id: userId,
              },
            },
          },
        ],
      },
    });

    if (existingLike.length > 0) {
      return res.status(409).send('This movie is already in your favorites.');
    }

    // Créez la relation UserLikes en connectant le film à l'utilisateur.
    const user = await prisma.user.update({
      where: {id: userId},
      data: {
        likes: {
          connect: {id: movieId},
        },
      },
    });

    // Réponse en cas de succès.
    return res
      .status(201)
      .json({message: 'Movie added to favorites successfully.', user});
  } catch (error) {
    console.error('Error adding movie to favorites: ', error);
    res.status(500).send('There was an error processing your request.');
  }
});

router.delete('/:id/remove-like', verifyToken, async (req, res) => {
  try {
    const userId = req.body.userId; // récupéré du token JWT
    const movieId = parseInt(req.params.id); // l'ID du film à ne plus liker

    // Vérifiez si le like existe déjà.
    const existingLike = await prisma.movie.findMany({
      where: {
        AND: [{id: movieId}, {likedBy: {some: {id: userId}}}],
      },
    });

    if (existingLike.length === 0) {
      return res
        .status(404)
        .send('This movie was not found in your favorites.');
    }

    // Retirez le like si le film était précédemment liké par l'utilisateur.
    const user = await prisma.user.update({
      where: {id: userId},
      data: {
        likes: {
          disconnect: {id: movieId},
        },
      },
    });

    // Réponse en cas de succès.
    return res
      .status(200)
      .json({message: 'Movie removed from favorites successfully.', user});
  } catch (error) {
    console.error('Error removing movie from favorites: ', error);
    res.status(500).send('There was an error processing your request.');
  }
});

module.exports = router;
