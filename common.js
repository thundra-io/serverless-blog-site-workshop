module.exports.sendHttpResponse = (statusCode, message, callback) => {
    const response = {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*" // Required for CORS support to work
        },
        body: (typeof message === 'string' || message instanceof String) ? message : JSON.stringify(message)
    };
    callback(null, response);
};
