const express = require('express');
const {
    getAllComments, getByCity, addComment, updateComment,
    } = require('../controllers/comment.controller');
const checkApiKey = require('../middleware/validateRequest');

const router = express.Router();

router.get('/comments', getAllComments);
router.get('/comments/city', getByCity);
router.post('/comment', checkApiKey, addComment);
router.put('/comment/:id', checkApiKey, updateComment);

module.exports = router;
