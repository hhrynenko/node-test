const express = require('express');
const { getByCity, addComment, updateComment } = require('../controllers/comment.controller');
const { paginationInputCheck } = require('../middleware/paginationInputCheck');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/comments/city', roleMiddleware(['USER', 'ADMIN']), paginationInputCheck, getByCity);
router.post('/comment', roleMiddleware(['ADMIN']), addComment);
router.put('/comment/:id', roleMiddleware(['ADMIN']), updateComment);

module.exports = router;
