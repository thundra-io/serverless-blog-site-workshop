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

module.exports.calculateHashCode = (s) => {
    if (!s) {
        return 0;
    }
    try {
        let h = 0, l = s.length, i = 0;
        if (l > 0) {
            while (i < l) {
                h = (h << 5) - h + s.charCodeAt(i++) | 0;
            }
        }
        return Math.abs(h);
    } catch (e) {
        console.error(`Unable to calculate hash code for string ${s}`);
    }
};
