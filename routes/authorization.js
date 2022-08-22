const express = require('express');
const { registerUser, loginUser } = require('../controllers/authorization.controller');
const { loginValidation } = require('../middleware/loginValidation');
const { regValidation } = require('../middleware/registerValidation');

const router = express.Router();

router.post('/registration', regValidation, registerUser);
router.post('/login', loginValidation, loginUser);

module.exports = router;
