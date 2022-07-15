const express = require('express');
const { getCitiesList } = require('../controllers/city.controller');

const router = express.Router();

router.get('/cities', getCitiesList);

module.exports = router;
