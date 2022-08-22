const { isEmpty } = require('lodash');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/models');
const { tokenSecretWord } = require('../utils/constants');

const Role = db.role;
const UserRoles = db.user_roles;
const User = db.user;

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
        return res.status(200).json({
            message: 'Successfully registered',
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

module.exports.loginUser = loginUser;
module.exports.registerUser = registerUser;
