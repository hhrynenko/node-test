const db = require('../db/models');

module.exports = {
    port: process.env.PORT,
    City: db.city,
    Comment: db.comment,
};
