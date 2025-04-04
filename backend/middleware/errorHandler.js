const { constants } = require("../Enums/routeErrors");

const errorHandler = (err, req, res, next) => {
    const statuscode = res.statusCode || constants.SERVER_ERROR;
    switch (statuscode) {
        case 400:
            res.json({
                title: "Validation Error",
                stack: res.stack
            })
            break;
        case 401:
            res.json({
                title: "Unauthorized",
                stack: res.stack
            })
            break;

        case 403:
            res.json({
                title: "Forbidden",
                stack: res.stack
            })
            break;
        case 404:
            res.json({
                title: "Not Found",
                stack: res.stack
            })
            break;
        case 500:
            res.json({
                title: "Server Error",
                stack: res.stack || "No stack"
            })
            break;
        default:
            console.log("No error on request")
            break;
    }
};


module.exports = errorHandler;
