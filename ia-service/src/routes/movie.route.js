import express from 'express';
import movie from '../controllers/movie';

const router = express.Router();

router.get('/', movie.fetchMovieReviews);
router.get('/search', movie.searchInAll);

router.get('/now-playing', movie.fetchNowPlaying);
router.get('/popular', movie.fetchMoviePopular);
router.get('/top-rated', movie.fetchMovieTopRated);
router.get('/upcoming', movie.fetchUpcoming);

export default router;
