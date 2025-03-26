const { constants } = require("../../constants");

const errorHandler = (err, req, res, next) => {    
    // Set a default status code if not already set
    const statusCode = res.statusCode && res.statusCode !== 200 
        ? res.statusCode 
        : constants.INTERNAL_SERVER_ERROR;

    
        // ✅ Ensure the status code is set before sending the response
    res.status(statusCode);

    // Error response mapping
    const errorResponse = {
        message: err.message || "Something went wrong",
        stackTrace: process.env.NODE_ENV === "development" ? err.stack : undefined, // Hide stack in production
    };

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            errorResponse.title = "Validation Failed";
            break;
        case constants.UNAUTHORIZED:
            errorResponse.title = "Unauthorized";
            break;
        case constants.FORBIDDEN:
            errorResponse.title = "Forbidden";
            break;
        case constants.NOT_FOUND:
            errorResponse.title = "Not Found";
            break;
        case constants.CONFLICT:
            errorResponse.title = "Conflict";
            break;
        case constants.UNPROCESSABLE_ENTITY:
            errorResponse.title = "Unprocessable Entity";
            break;
        case constants.INTERNAL_SERVER_ERROR:
            errorResponse.title = "Internal Server Error";
            break;
        default:
            errorResponse.title = "Unknown Error";
    }

    // ✅ Send the response
    res.json(errorResponse);
};

module.exports = errorHandler;
