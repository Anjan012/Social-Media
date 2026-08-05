import { ApiError } from "../utils/error/api-error.js";

export const errorHandler = (err, req, res, next) => {
     console.log("ERROR:", err);
    console.log("INSTANCE OF API ERROR:", err instanceof ApiError);
    console.log("STATUS:", err.statusCode);
    // "Is this error created intentionally by my application
    const isOperationalError = err instanceof ApiError;

    if(!isOperationalError) {
        console.error({
            message: err.message,
            stack: err.stack,
            url: req.OriginalUrl,
            method: req.method
        });
    }

    return res.status(
        isOperationalError ? err.statusCode : 500
    ).json({
        success: false,
        message: isOperationalError ? err.message : " Internal Server Error",
        // conditional object spreading.
        ...(isOperationalError && {
            details: err.details
        })
    });
};