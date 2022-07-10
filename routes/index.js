const express = require('express');
const {
    getAllComments, getByCity, addComment, updateComment,
    } = require('../controllers/commentsController');
const checkApiKey = require('../middleware/checkApiKey');
const { getCitiesList } = require('../controllers/citiesController');

const router = express.Router();

router.get('/comments', getAllComments);
router.get('/comments/city', getByCity);
router.get('/cities', getCitiesList);
router.post('/comment', checkApiKey, addComment);
router.put('/comment/:id', checkApiKey, updateComment);

module.exports = router;
