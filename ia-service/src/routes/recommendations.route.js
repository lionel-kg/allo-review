import express from 'express';
import recommendations from '../controllers/recommendations';

const router = express.Router();

router.post('/', recommendations.generateRecommendations);

export default router;
