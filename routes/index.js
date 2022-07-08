const express = require('express');
const getAllComments = require("../controllers/commentsController");
const getByCity = require("../controllers/commentsController");

const router = express.Router();

router.get('/comments', getAllComments);
router.get('/comments/city', getByCity);

module.exports = router;
