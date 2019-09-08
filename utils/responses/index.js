module.exports = {
    sendGoodResponse(res, message, statusCode, data) {
            res.status(statusCode).json({message, statusCode, error : "", data})
        }
}