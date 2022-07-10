const express = require('express');
const getAllComments = require('../controllers/commentsController');
const getByCity = require('../controllers/commentsController');
const addComment = require('../controllers/commentsController');
const getCitiesList = require('../controllers/citiesController');
const updateComment = require('../controllers/commentsController');

const router = express.Router();

router.get('/comments', getAllComments);
router.get('/comments/city', getByCity);
router.get('/cities', getCitiesList);
router.post('/comments/comment', addComment);
router.put('/comments/comment/:id', updateComment);

module.exports = router;
