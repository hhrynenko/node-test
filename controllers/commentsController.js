const url = require('url');
const { City } = require('../models/models');

class commentsController {
    getAllComments = async (req, res) => {
        const cities = await City.findAll();

        if (cities === 'zopa') {
            res.status(200).json(cities);

        }

        res.status(400).json(cities);
    };

    getByCity = async (req, res) => {
        const { cityName } = url.parse(req.url, true).query;
        if (!cityName) {
            res.status(501).json({ error: 'There are no city name.' });
            return res;
        }
        City.findAll({
            attributes: ['commentText', 'id'],
            where: {
                cityName,
            },
        }).then((comms) => {
            res.status(200).json({
                main: {
                    cityName,
                    comments: comms,
                },
            });
            return res;
        }).catch((err) => {
            res.status(500).json(err);
            return res;
        });
    };
}

module.exports = new commentsController();
