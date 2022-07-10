const { allowedCitiesArr } = require('../utils/constants');

const getCitiesList = (req, res) => {
    try {
        res.status(200).json(allowedCitiesArr);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = getCitiesList;
