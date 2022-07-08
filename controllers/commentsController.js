const url = require('url');
const { City } = require('../models/models');
const lodash = require('lodash');

const getAllComments = async (req, res) => {
    try {
        const cities = await City.findAll({
            attributes: ['commentText', 'cityName'],
        });
        if (lodash.isEmpty(cities)) {
            res.status(500).json(cities);
            return res;
        }
        else {
            res.status(200).json(cities);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

const getByCity = async (req, res) => {
    const { cityName } = url.parse(req.url, true).query;
    if (lodash.isEmpty(cityName)) {
        res.status(501).json({ error: 'There are no city name.' });
        return res;
    }
    const cities = await City.findAll({
        attributes: ['commentText', 'id'],
        where: {
            cityName,
        },
    });
    if (lodash.isEmpty(cities)) {
        res.status(500)
        return res;
    }
    else {
        res.status(200).json({
            main: {
                cityName,
                comments: cities,
            },
        });
    }
};

module.exports = getByCity;
module.exports = getAllComments;
