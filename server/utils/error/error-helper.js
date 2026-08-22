import {ApiError} from "./api-error.js";


// Generic helper
const throwError = (statusCode, message, details = null) => {
    throw new ApiError(statusCode, message, {
        details
    });
};


export const badRequest = (
    message = "Bad request",
    details
) => throwError(400, message, details);


export const unauthorized = (
    message = "Unauthorized",
    details
) => throwError(401, message, details);


export const forbidden = (
    message = "Forbidden",
    details
) => throwError(403, message, details);


export const notFound = (
    message = "Resource not found",
    details
) => throwError(404, message, details);


export const conflict = (
    message = "Conflict",
    details
) => throwError(409, message, details);


export const internalServerError = (
    message = "Internal server error",
    details
) => throwError(500, message, details);
