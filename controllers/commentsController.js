const url = require('url');
const { isEmpty } = require('lodash');
const { City } = require('../models/models');
const { allowedCitiesArr } = require('../utils/constants');

const getAllComments = async (req, res) => {
    try {
        const cities = await City.findAll({
            attributes: ['commentText', 'cityName'],
        });
        if (isEmpty(cities)) {
            return res.status(500).json(cities);
        }
        return res.status(200).json(cities);
    } catch (err) {
        return res.status(500).json(err);
    }
};

const getByCity = async (req, res) => {
    const { cityName } = url.parse(req.url, true).query;
    if (isEmpty(cityName)) {
        return res.status(501).json({
            error: 'There are no city name.',
        });
    }
    const comments = await City.findAll({
        attributes: ['commentText', 'id'],
        where: {
            cityName,
        },
    });
    if (isEmpty(comments)) {
        return res.status(500).json({
            error: 'There are no comments.',
        });
    }
    return res.status(200).json({
        main: {
            cityName,
            comments,
        },
    });
};

const addComment = async (req, res) => {
    try {
        if (isEmpty(req.body)) {
            return res.status(500).json({
                error: 'Request body is empty.',
            });
        }
        const { cityName, commentText } = req.body;
        const commentToSave = allowedCitiesArr.find((city) => city === cityName);
        if (isEmpty(commentToSave)) {
            return res.status(500).json({
                error: `There are no ${cityName} in list. For full list see: /api/cities/`,
            });
        }
        await City.create({
            cityName,
            commentText,
        });
        return res.status(200).json({
            message: 'Successfully added new comment',
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};

const updateComment = async (req, res) => {
    try {
        if (isEmpty(req.body)) {
            return res.status(500).json({
                error: 'Request body is empty.',
            });
        }
        const { newCommentText } = req.body;
        const id = parseInt(req.params.id, 10);
        if (id > await City.count()) {
            return res.status(500).json({
                error: 'Id is not found in DB',
            });
        }
        await City.update({ commentText: newCommentText }, {
            where: {
                id,
            },
        });
        return res.status(200).json({
            message: `Successfully updated comment #${id}`,
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports = getByCity;
module.exports = getAllComments;
module.exports = addComment;
module.exports = updateComment;
