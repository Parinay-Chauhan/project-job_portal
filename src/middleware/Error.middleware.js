const ErrorHandler = (err, req, res, next) => {
    console.log("Middleware Error Handling");
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).json({
        message: errMsg,
        success: false,
        statusCode: errStatus,
        // stack: process.env.NODE_ENV === 'development' ? err.stack : {}
        // stack: ""
    })
}

export { ErrorHandler }
