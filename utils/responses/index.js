module.exports = {
    sendGoodResponse(res, message, statusCode, data) {
            res.status(statusCode).json({
                message, statusCode, error : "", data
            })
        },
    sendErrorResponse(res, message, statusCode, error){
        res.status(statusCode).json({
           message, 
           error 
        })
    }    
}