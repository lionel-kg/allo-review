import express from 'express';
const router = express.Router();

import naturalLanguage from './naturalLanguage.route';
import movie from './movie.route';
import recommendations from './recommendations.route';

router.use('/movie', movie);
router.use('/recommendations', recommendations);
router.use('/naturalLanguage', naturalLanguage);

export default router;
