module.exports.sendHttpResponse = (statusCode, message, callback) => {
    const response = {
        statusCode: statusCode,
        body: JSON.stringify(message)
    };
    callback(null, response);
};
