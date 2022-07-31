const url = require('url');
const { isEmpty } = require('lodash');
const { City, Comment } = require('../models/models');
const { getPagination, getTotalPages } = require('./pagination.controller');

const getByCity = async (req, res) => {
    try {
        const { cityName } = url.parse(req.url, true).query;
        const currPage = req.query.page;
        const size = req.query.limit;
        if (isEmpty(cityName)) {
            return res.status(500).json({
                error: 'No city name.',
            });
        }
        const { limit, offset } = getPagination(currPage, size);
        const id = await City.findOne({
            attributes: ['id', 'averageGrade'],
            where: {
                cityName,
            },
        });
        if (!id) {
            return res.status(500).json({
                error: 'Wrong city name.',
            });
        }
        const comments = await Comment.findAndCountAll({
            attributes: ['commentText', 'id'],
            limit,
            offset,
            order: [
                ['id', 'ASC'],
            ],
            where: {
                cityId: id.id,
            },
            raw: true,
        });
        if (isEmpty(comments.rows)) {
            return res.status(500).json({
                error: 'No page.',
            });
        }
        const totalPages = getTotalPages(comments.count, limit);
        return res.status(203).json({
            main: {
                cityName,
                averageGrade: id.averageGrade,
                currPage,
                totalPages,
                comments,
            },
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};

const addComment = async (req, res) => {
    try {
        const { cityName, commentText, commentGrade } = req.body;
        if (!cityName || !commentText || !commentGrade) {
            return res.status(500).json({
                error: 'Request body is not full.',
            });
        }
        if (commentGrade > 10 || commentGrade < 1 || !Number.isInteger(commentGrade)) {
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
        const commentInDb = await Comment.create({
            commentText,
            cityId: cityInDb.id,
            cityGrade: commentGrade,
        });
        if (isEmpty(commentInDb)) {
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
        const gradesSum = allGradesByCity
            .reduce((partialSum, grade) => partialSum + grade.dataValues.cityGrade, 0);
        const result = gradesSum / allGradesByCity.length;
        await City.update({
                averageGrade: result.toFixed(2),
            }, {
                where: {
                    id: cityInDb.id,
                },
            });
        return res.status(200).json({
            message: 'Successfully added new comment.',
            newAverageGrade: result.toFixed(2),
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
            if (!Number.isInteger(newGrade) || newGrade < 1 || newGrade > 10) {
                return res.status(500).json({
                    error: 'newGrade have problems. Number from 1 to 10 is allowed.',
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
            const gradesSum = allGradesByCity
                .reduce((partialSum, grade) => partialSum + grade.dataValues.cityGrade, 0);
            const result = gradesSum / allGradesByCity.length;
            await City.update({
                averageGrade: result.toFixed(2),
            }, {
                where: {
                    id: cityInDb.cityId,
                },
            });
            return res.status(200).json({
                message: `Successfully updated comment and grade #${id}`,
                newAverageGrade: result.toFixed(2),
            });
        }
        await Comment.update({ commentText }, {
            where: {
                id,
            },
        });
        return res.status(200).json({
            message: `Successfully updated comment #${id}`,
            newCommentText: commentText,
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports.getByCity = getByCity;
module.exports.addComment = addComment;
module.exports.updateComment = updateComment;
