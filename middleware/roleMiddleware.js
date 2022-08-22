const jwt = require('jsonwebtoken');
const { tokenSecretWord } = require('../utils/constants');

module.exports = (roles) => (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(403).json({
                    message: 'Log in please.',
                });
            }
            const { roles: userRoles } = jwt.verify(token, tokenSecretWord);
            let hasRole = false;
            userRoles.forEach((role) => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });
            if (!hasRole) {
                return res.status(403).json({
                    message: 'No access.',
                });
            }
            return next();
        } catch (e) {
            return res.status(403).json({
                message: 'Log in please.',
            });
        }
    };
