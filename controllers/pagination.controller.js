const getPagination = (currPage, size) => {
    const limit = size;
    const offset = (currPage - 1) * size;
    return { limit, offset };
};

const getTotalPages = (allElemsCount, limit) => Math.ceil(allElemsCount / limit);

module.exports.getPagination = getPagination;
module.exports.getTotalPages = getTotalPages;
