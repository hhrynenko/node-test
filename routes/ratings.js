const express = require('express');
const { getTopCities } = require('../controllers/rating.controller');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/ratings/top', roleMiddleware(['USER', 'ADMIN']), getTopCities);

module.exports = router;
