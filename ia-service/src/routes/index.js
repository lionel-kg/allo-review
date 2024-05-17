import express from 'express';
const router = express.Router();

import naturalLanguage from './naturalLanguage.route';
import movie from './movie.route';

router.use('/movie', movie);
router.use('/naturalLanguage', naturalLanguage);

export default router;
