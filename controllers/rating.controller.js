const url = require('url');
const sequelize = require('sequelize');
const { isEmpty } = require('lodash');
const { City, Comment } = require('../models/models');

const getTopCities = async (req, res) => {
    try {
        const { lim } = url.parse(req.url, true).query;
        if (isEmpty(lim)) {
            return res.status(500).json({
                error: 'Address query is empty.',
            });
        }
        if (lim <= 0 || !Number.isInteger(lim)) {
            return res.status(500).json({
                error: 'Limit is not correct ([1-...]])',
            });
        }
        const topCities = await City.findAll({
            order: sequelize.literal('"averageGrade" DESC'),
            limit: lim,
        });
        if (!topCities) {
            return res.status(500).json({
                error: 'Something went wrong with the query.',
            });
        }
        const comments = await Comment.findAll();
        if (isEmpty(comments)) {
            return res.status(500).json({
                error: 'There are no comments.',
            });
        }
        const result = topCities.map((city) => {
            const cityComments = comments
                .filter((comment) => comment.dataValues.cityId === city.dataValues.id);
            return {
                ...city.dataValues,
                comments: cityComments,
            };
        });
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports.getTopCities = getTopCities;
