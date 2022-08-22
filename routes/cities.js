const express = require('express');
const { getCitiesList, getCommentsByCities } = require('../controllers/city.controller');
const { paginationInputCheck } = require('../middleware/paginationInputCheck');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/cities', roleMiddleware(['USER', 'ADMIN']), paginationInputCheck, getCitiesList);
router.get('/cities/:ids/comments', roleMiddleware(['USER', 'ADMIN']), getCommentsByCities);

module.exports = router;
