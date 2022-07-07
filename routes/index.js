const express = require('express');
const commentsController = require('../controllers/commentsController');

const router = express.Router();

router.get('/city', commentsController.getAllComments);

router.get('/getByCity', commentsController.getByCity);

module.exports = router;
