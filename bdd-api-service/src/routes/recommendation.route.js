const express = require('express');
const router = express.Router();
const recommendations = require('../controller/recommendations.js');
const verifyToken = require('../middleware/verifyToken.js');

router.post('/', verifyToken, recommendations.addRecommendationsList);
router.get('/:id', recommendations.getRecommendationsListById);
router.get('/user/:id', verifyToken, recommendations.getUserRecommendations);

module.exports = router;
