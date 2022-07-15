const { City } = require('../models/models');

const getCitiesList = async (req, res) => {
    try {
        const cities = await City.findAll({
            attributes: ['cityName'],
        });
        const result = cities.map((city) => ({ ...city.dataValues }));
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports.getCitiesList = getCitiesList;
