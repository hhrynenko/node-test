const { isEmpty } = require('lodash');
const { Op } = require('sequelize');
const { regEmail, regPassword, regUsername } = require('../utils/constants');
const db = require('../db/models');

const User = db.user;

const regValidation = async (req, res, next) => {
    const { email, username, password } = req.body;
    if (isEmpty(email) || isEmpty(username) || isEmpty(password)) {
        return res.status(500).json({
            error: 'Body is not full.',
        });
    }
    const checkIfUserAlreadyExists = await User.findOne({
        where: {
            [Op.or]: {
                email,
                username,
            },
        },
    });
    if (!isEmpty(checkIfUserAlreadyExists)) {
        return res.status(500).json({
            error: 'User already exists',
        });
    }
    if (!regEmail.test(email)) {
        return res.status(500).json({
            email,
            error: 'Email is not valid.',
        });
    }
    if (!regPassword.test(password)) {
        return res.status(500).json({
            password,
            error: 'Password is not valid.',
        });
    }
    if (!regUsername.test(username)) {
        return res.status(500).json({
            username,
            error: 'Username is not valid.',
        });
    }
    if (username.length < 4 || username.length > 16) {
        return res.status(500).json({
            error: 'Your username must be from 6 to 16 symbols long.',
        });
    }
    if (password.length > 16 || password.length < 6) {
        return res.status(500).json({
            error: 'Your password must be from 6 to 16 symbols long.',
        });
    }
    return next();
};

module.exports.regValidation = regValidation;
