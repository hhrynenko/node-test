const express = require('express');
const getAllComments = require('../controllers/commentsController');
const getByCity = require('../controllers/commentsController');
const addComment = require('../controllers/commentsController');
const getCitiesList = require('../controllers/citiesController');
const updateComment = require('../controllers/commentsController');
const checkApiKey = require("../middleware/checkApiKey");

const router = express.Router();

router.get('/comments', getAllComments);
router.get('/comments/city', getByCity);
router.get('/cities', getCitiesList);
router.post('/comment', checkApiKey, addComment);
router.put('/comment/:id', checkApiKey, updateComment);

module.exports = router;
