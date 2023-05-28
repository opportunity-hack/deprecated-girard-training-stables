const {
    InvalidTokenError,
    UnauthorizedError,
    InsufficientScopeError,
} = require("express-oauth2-jwt-bearer");

if (process.env.NODE_ENV !== "production") {
    const dotenv = require("dotenv");
    dotenv.config()
}

const winston = require("winston");
const { combine, timestamp, json, errors } = winston.format;
const logger = winston.createLogger({
  level: "info",
  format: combine(errors({ stack: process.env.NODE_ENV !== 'production' }),
      timestamp(), json()),  
  transports: [new winston.transports.Console()],
});

const errorHandler = (err, req, res, next) => {
    logger.error(err);

    if (err instanceof InsufficientScopeError) {
        const message = "Permission denied";
        res.status(err.status).json({ message });

        return
    }

    if (err instanceof InvalidTokenError) {
        const message = "Bad credentials";
        res.status(err.status).json({ message });

        return
    }

    if (err instanceof UnauthorizedError) {
        const message = "Requires authentication";

        res.status(err.status).json({ message });

        return
    }

    const statusCode = res.statusCode ? res.statusCode : 500;
    
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = {errorHandler}
