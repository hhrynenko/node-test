const paginationInputCheck = (req, res, next) => {
    const page = parseInt(req.query.page, 10);
    const lim = parseInt(req.query.limit, 10);
    if (page <= 0 || lim <= 0 || !page || !lim
        || !Number.isInteger(lim) || !Number.isInteger(page)) {
        return res.status(500).json({
            error: 'Page or limit variables is incorrect. Example: ?page=1&limit=4',
        });
    }
    return next();
};

module.exports.paginationInputCheck = paginationInputCheck;
