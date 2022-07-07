const express = require('express');
const getAllComments = require("../controllers/commentsController");
const getByCity = require("../controllers/commentsController");

const router = express.Router();

router.get('/city', getAllComments);
router.get('/getByCity', getByCity);

module.exports = router;
