const express = require('express');
const getAllComments = require("../controllers/commentsController");
const getByCity = require("../controllers/commentsController");

const router = express.Router();

router.get('/comments/comment/all', getAllComments);
router.get('/comments/comment/by-City', getByCity);

module.exports = router;
