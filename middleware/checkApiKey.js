const checkApiKey = (req, res, next) => {
    if (req.get('API-Key') !== process.env.HEADER_KEY) {
        return res.status(403).json({
            error: 'Api key is required for this function.',
        });
    }
    return next();
};

module.exports = checkApiKey;
