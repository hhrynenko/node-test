const { isEmpty } = require('lodash');

const loginValidation = (req, res, next) => {
    const { email, password } = req.body;
    if (isEmpty(email) || isEmpty(password)) {
        return res.status(500).json({
            error: 'Body is not full.',
        });
    }
    return next();
};

module.exports.loginValidation = loginValidation;
