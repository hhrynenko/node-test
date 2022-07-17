const express = require('express');
const { getTopCities } = require('../controllers/rating.controller');

const router = express.Router();

router.get('/ratings/top', getTopCities);

module.exports = router;
