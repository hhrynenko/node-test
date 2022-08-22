const { isEmpty, split } = require('lodash');
const { Op } = require('sequelize');
const db = require('../db/models');
const { getPagination, getTotalPages } = require('./pagination.controller');

const City = db.city;
const Comment = db.comment;

const getCitiesList = async (req, res) => {
    try {
        const currPage = req.query.page;
        const size = req.query.limit;
        const { limit, offset } = getPagination(currPage, size);
        const cities = await City.findAndCountAll({
            order: [
                ['id', 'ASC'],
            ],
            limit,
            offset,
            raw: true,
        });
        if (isEmpty(cities.rows)) {
            return res.status(500).json({
                error: 'No page.',
            });
        }
        const totalPages = getTotalPages(cities.count, limit);
        return res.status(200).json({
            currentPage: currPage,
            limit,
            totalPages,
            cities,
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};

const getCommentsByCities = async (req, res) => {
    try {
        if (isEmpty(req.params.ids)) {
            return res.status(500).json({
                error: 'Params is empty.',
            });
        }
        const ids = split(req.params.ids, ',');
        if (isEmpty(ids)) {
            return res.status(500).json({
                error: 'Parameters is wrong.',
            });
        }
        const citiesInDb = await City.findAll({
            where: {
                id: {
                    [Op.or]: ids,
                },
            },
            raw: true,
        });
        if (isEmpty(citiesInDb)) {
            return res.status(500).json({
                error: 'Unable to find cities from DB or id is not find.',
            });
        }
        const commentsInDb = await Comment.findAll({
            where: {
                cityId: {
                    [Op.or]: ids,
                },
            },
            raw: true,
        });
        const result = citiesInDb.map((city) => {
            const cityComments = commentsInDb
                .filter((comment) => comment.cityId === city.id);
            return {
                city,
                comments: cityComments,
            };
        });
        return res.status(200).json(result);
    } catch (err) {
        if (err.original.code === '22P02') {
            return res.status(500).json({
                error: 'Wrong ids input.',
            });
        }
        return res.status(500).json(err);
    }
};

module.exports.getCitiesList = getCitiesList;
module.exports.getCommentsByCities = getCommentsByCities;
