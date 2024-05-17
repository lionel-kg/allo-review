import express from 'express';
const router = express.Router();
import naturalLanguage from '../controllers/naturalLanguage';

router.post('/analyze-sentiment', naturalLanguage.fetchNaturalLanguage);

export default router;
