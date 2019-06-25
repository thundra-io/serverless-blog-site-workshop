module.exports.sendHttpResponse = (statusCode, message, callback) => {
    const response = {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*" // Required for CORS support to work
        },
        body: JSON.stringify(message)
    };
    callback(null, response);
};
