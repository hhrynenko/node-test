const url = require('url');
const { isEmpty, get } = require('lodash');
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
        const id = await City.findOne({
            attributes: ['id'],
            where: {
                cityName,
            },
        });
        if (!id) {
            return res.status(500).json({
                error: 'Wrong city name.',
            });
        }
        const comments = await Comment.findAll({
            attributes: ['commentText'],
            where: {
                cityId: id.id,
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
        if (isEmpty(req.body.cityName)) {
            return res.status(500).json({
                error: 'Request body is not full.',
            });
        }
        const { cityName, commentText, commentGrade } = req.body;
        if (commentGrade > 10 || commentGrade < 1 || Number.isInteger(commentGrade)) {
            return res.status(500).json({
                error: `Entered grade is ${commentGrade}, but allowed is [1-10] or grade is not number.`,
            });
        }
        const cityInDb = await City.findOne({
            where: {
                cityName,
            },
        });
        if (isEmpty(cityInDb)) {
            return res.status(500).json({
                error: `There are no ${cityName} in list. For full list see: /api/cities/`,
            });
        }
        const ifCommentInDb = await Comment.create({
            commentText,
            cityId: cityInDb.id,
            cityGrade: commentGrade,
        });
        if (isEmpty(ifCommentInDb)) {
            return res.status(500).json({
                error: 'Unsuccessful attempt to add a new comment.',
            });
        }
        const allGradesByCity = await Comment.findAll({
            attributes: ['cityGrade'],
            where: {
                cityId: cityInDb.id,
            },
        });
        const result = allGradesByCity
            .reduce((partialSum, grade) => partialSum + grade.dataValues.cityGrade, 0)
            / allGradesByCity.length;
        await City.update({
                averageGrade: get(result.toFixed(2), 0),
            }, {
                where: {
                    id: cityInDb.id,
                },
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
        if (isEmpty(req.body.commentText)) {
            return res.status(500).json({
                error: 'Request body is empty.',
            });
        }
        const { commentText } = req.body;
        const id = parseInt(req.params.id, 10);
        const cityInDb = await Comment.findOne({
            where: {
                id,
            },
        });
        if (isEmpty(cityInDb)) {
            return res.status(500).json({
                error: 'Id is not found in DB',
            });
        }
        if (req.body.newGrade) {
            const { newGrade } = req.body;
            if (!Number.isInteger(newGrade)) {
                return res.status(500).json({
                    error: 'New grade is not number.',
                });
            }
            await Comment.update({ commentText, cityGrade: newGrade }, {
                where: {
                    id,
                },
            });
            const allGradesByCity = await Comment.findAll({
                attributes: ['cityGrade'],
                where: {
                    cityId: cityInDb.cityId,
                },
            });
            const result = allGradesByCity
                    .reduce((partialSum, grade) => partialSum + grade.dataValues.cityGrade, 0)
                / allGradesByCity.length;
            await City.update({
                averageGrade: get(result.toFixed(2), 0),
            }, {
                where: {
                    id: cityInDb.cityId,
                },
            });
            return res.status(200).json({
                message: `Successfully updated comment and grade #${id}`,
            });
        } else {
            await Comment.update({ commentText }, {
                where: {
                    id,
                },
            });
            return res.status(200).json({
                message: `Successfully updated comment #${id}`,
            });
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports.getByCity = getByCity;
module.exports.getAllComments = getAllComments;
module.exports.addComment = addComment;
module.exports.updateComment = updateComment;
