const errorHandler = (err, req, res, next) => {

    console.error(err.message);

    if (res.headersSent) {
        return next(err);
    }

    const status = err.status === 400 ||
        err.name === "ValidationError" ? 400 : 500;

    res.status(status).json({
        success: false,
        message: status === 400
            ? "Invalid request"
            : "Internal server error"
    });

};

export default errorHandler;