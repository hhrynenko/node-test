const express = require('express');
const { getCitiesList, getCommentsByCities } = require('../controllers/city.controller');
const { paginationInputCheck } = require('../middleware/paginationInputCheck');

const router = express.Router();

router.get('/cities', paginationInputCheck, getCitiesList);
router.get('/cities/:ids/comments', getCommentsByCities);

module.exports = router;
