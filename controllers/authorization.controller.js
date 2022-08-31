const { isEmpty } = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const db = require('../db/models');
require('dotenv').config();
const { tokenSecretWord, regUidV4, confirmationLink } = require('../utils/constants');
const mailer = require('../services/mailerService');

const Role = db.role;
const UserRoles = db.user_roles;
const User = db.user;
const UserConfirmCodes = db.user_confirm_codes;

const generateToken = (id, roles) => {
    const payload = {
        id,
        roles,
    };
    return jwt.sign(payload, tokenSecretWord, { expiresIn: '12h' });
};

const registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const findUserRole = await Role.findOne({
            attributes: ['id'],
            where: {
                roleName: 'USER',
            },
            raw: true,
        });
        if (isEmpty(findUserRole)) {
            return res.status(500).json({
                error: 'No role.',
            });
        }
        const roleId = findUserRole.id;
        const hashedPassword = bcrypt.hashSync(password, 7);
        const newUserToDb = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        const newUserId = newUserToDb.dataValues.id;
        await UserRoles.create({
            roleId,
            userId: newUserId,
        });
        const uuidForNewUser = await UserConfirmCodes.create({
            userId: newUserId,
        });
        const currentLink = confirmationLink + uuidForNewUser.dataValues.verifyCode;
        const message = {
            to: email,
            subject: 'Successful registration!',
            html: `<a href=${currentLink}> Confirm your account </a>`,
        };
        mailer(message);
        return res.status(200).json({
            message: 'Successfully registered. Verify your account!',
            email,
            username,
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userInTableUser = await User.findOne({
            where: {
                email,
            },
            include: Role,
        });
        if (!userInTableUser) {
            return res.status(500).json({
                error: 'User with this email doesn\'t exist',
            });
        }
        if (userInTableUser.dataValues.verified === false) {
            return res.status(500).json({
                error: 'User with this email is not verified.',
            });
        }
        const validPassword = bcrypt.compareSync(password, userInTableUser.password);
        if (!validPassword) {
            return res.status(500).json({
                error: 'Password is incorrect.',
            });
        }
        const userRoles = userInTableUser.dataValues.roles.map((role) => role.dataValues.roleName);
        const userId = userInTableUser.dataValues.id;
        const token = generateToken(userId, userRoles);
        return res.status(200).json({
            message: 'Successful login.',
            token,
        });
    } catch (e) {
        return res.status(500).json(e);
    }
};

const userConfirmation = async (req, res) => {
    try {
        if (isEmpty(req.params.uid)) {
            return res.status(500).json({
                error: 'Params is empty.',
            });
        }
        const { uid } = req.params;
        if (!regUidV4.test(uid)) {
            return res.status(500).json({
                error: 'Wrong code type.',
            });
        }
        const uidDataFromTable = await UserConfirmCodes.findOne({
            where: {
                verifyCode: uid,
            },
            include: User,
        });
        if (isEmpty(uidDataFromTable)) {
            return res.status(500).json({
                error: 'No confirm code.',
            });
        }
        if (uidDataFromTable.dataValues.expiresAt < moment()) {
            return res.status(500).json({
                error: 'Token has expired.',
            });
        }
        await User.update({ verified: true }, {
            where: {
                id: uidDataFromTable.dataValues.user.id,
            },
        });
        await UserConfirmCodes.destroy({
            where: {
                id: uidDataFromTable.dataValues.id,
            },
        });
        return res.status(200).json({
            message: 'Account has been successfully verified!',
        });
    } catch (e) {
        return res.status(500).json(e);
    }
};

module.exports.userConfirmation = userConfirmation;
module.exports.loginUser = loginUser;
module.exports.registerUser = registerUser;
