function sendBadResponse({response, message, statusCode, data = []}) {
  response
    .status(statusCode)
    .json({error: message, data, statusCode});
}
function sendGoodResponse({
  response,
  message,
  statusCode = 200,
  data = []
}) {
  response.status(statusCode).json({message, data});
}
module.exports = {sendBadResponse, sendGoodResponse};
