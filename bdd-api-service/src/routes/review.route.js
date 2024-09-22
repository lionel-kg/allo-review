const express = require('express');
const router = express.Router();
const prisma = require('../config/db.js');
const {AddReviews, GetAppreciation} = require('../helpers/movie.js');

// POST /reviews - Create a new review
router.post('/', async (req, res) => {
  const {movieId} = req.body;
  try {
    const movie = await prisma.movie.findUnique({
      where: {id: movieId},
      include: {reviews: true},
    });
    const appreciations = await prisma.appreciation.findMany();
    const review = await AddReviews(movie, appreciations, req.body);
    if (review) {
      let totalScore = review?.review_score || 0;
      let totalMagnitude = review?.review_magnitude || 0;

      movie.reviews?.map(review => {
        totalScore += review?.review_score || 0;
        totalMagnitude += review?.review_magnitude || 0;
      });
      const globalAppreciation = await GetAppreciation({
        score: totalScore / (movie.reviews.length + 1),
        magnitude: totalMagnitude / (movie.reviews.length + 1),
        appreciations,
      });
      let updatedMovie;

      try {
        console.log(movie.id);
        updatedMovie = await prisma.movie.update({
          where: {
            id: movie.id,
          },
          data: {appreciation: {connect: {id: globalAppreciation.id}}},
          include: {
            reviews: true,
            genres: true,
            appreciation: true,
          },
        });
        console.log('ici', updatedMovie);
        return res.status(201).json(updatedMovie); // Return updatedMovie
      } catch (innerMovieError) {
        console.error(
          `Error processing global appreciation add to movie ${movie.id}: ${innerMovieError.message}`,
        );
        return res.status(500).json({message: 'Error updating movie'});
      }
    }

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(400).json({message: error.message});
  }
});

// GET /reviews - Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

router.post('/exists', async (req, res) => {
  const {tmdb_id} = req.body;
  try {
    const review = await prisma.review.findUnique({
      where: {tmdb_id: tmdb_id},
    });
    if (review) {
      res.json(review);
    } else {
      res.status(404).json({message: 'Review not found'});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message});
  }
});

// GET /reviews/:id - Get a single review by id
router.get('/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const review = await prisma.review.findUnique({
      where: {tmdb_id: id},
    });

    if (review) {
      res.json(review);
    } else {
      res.status(404).json({message: 'Review not found'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// PUT /reviews/:id - Update a review
router.put('/:id', async (req, res) => {
  const {id} = req.params;
  const {author, author_details, content, updated_at} = req.body;
  try {
    const review = await prisma.review.update({
      where: {id: parseInt(id)},
      data: {
        author,
        author_details,
        content,
        updated_at: updated_at || new Date(),
      },
    });
    res.json(review);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// DELETE /reviews/:id - Delete a review
router.delete('/:id', async (req, res) => {
  const {id} = req.params;
  try {
    await prisma.review.delete({
      where: {id: parseInt(id)},
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

module.exports = router;
