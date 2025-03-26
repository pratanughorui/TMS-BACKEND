const successHandler = (res, statusCode, message, data = null, token) => {
    const response = {
        success: true,
        message,
    };

    if (data !== null) {
        response.data = data;
    }

    if (token) {
        response.token = token;
    }

    res.status(statusCode).json(response);
};

module.exports = successHandler;
