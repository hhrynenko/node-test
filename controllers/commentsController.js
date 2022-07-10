const url = require('url');
const { isEmpty } = require('lodash');
const { City, Comment } = require('../models/models');

const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.findAll();
        const cities = await City.findAll();
        const result = cities.map((city) => {
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

const getByCity = async (req, res) => {
    try {
        const { cityName } = url.parse(req.url, true).query;
        if (isEmpty(cityName)) {
            return res.status(501).json({
                error: 'There are no city name.',
            });
        }
        const { id } = await City.findOne({
            attributes: ['id'],
            where: {
                cityName,
            },
        });
        if (id === null) {
            return res.status(500).json({
                error: 'Wrong city name.',
            });
        }
        const comments = await Comment.findAll({
            attributes: ['commentText'],
            where: {
                cityId: id,
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
    } catch (err) {
        return res.status(500).json(err);
    }
};

const addComment = async (req, res) => {
    try {
        if (isEmpty(req.body)) {
            return res.status(500).json({
                error: 'Request body is empty.',
            });
        }
        const { cityName, commentText } = req.body;
        const comment = await City.findOne({
            where: {
                cityName,
            },
        });
        if (isEmpty(comment)) {
            return res.status(500).json({
                error: `There are no ${cityName} in list. For full list see: /api/cities/`,
            });
        }
        await Comment.create({
            commentText,
            cityId: comment.id,
        });
        return res.status(200).json({
            message: 'Successfully added new comment.',
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
        const { commentText } = req.body;
        const id = parseInt(req.params.id, 10);
        const idCheck = await Comment.findOne({
            where: {
                id,
            },
        });
        if (isEmpty(idCheck)) {
            return res.status(500).json({
                error: 'Id is not found in DB',
            });
        }
        await Comment.update({ commentText }, {
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

module.exports.getByCity = getByCity;
module.exports.getAllComments = getAllComments;
module.exports.addComment = addComment;
module.exports.updateComment = updateComment;
