module.exports = class DoccenterError extends Error {
    constructor(message, statusCode = 500, data = null) {
        super(message);
        
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.data = data;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}