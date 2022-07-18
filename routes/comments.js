const express = require('express');
const {
        getByCity, addComment, updateComment,
    } = require('../controllers/comment.controller');
const checkApiKey = require('../middleware/authMiddleware');
const { paginationInputCheck } = require('../middleware/paginationInputCheck');

const router = express.Router();

router.get('/comments/city', paginationInputCheck, getByCity);
router.post('/comment', checkApiKey, addComment);
router.put('/comment/:id', checkApiKey, updateComment);

module.exports = router;
