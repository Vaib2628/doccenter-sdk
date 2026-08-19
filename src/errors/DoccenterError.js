class DoccenterError extends Error {
    /**
     * @param {string} message - Human-readable error message
     * @param {number} [statusCode=500] - HTTP status code (e.g. 400, 401, 404, 500, or 0 for network failure)
     * @param {any} [data=null] - Additional error payload from the server or error details
     */
    constructor(message, statusCode = 500, data = null) {
        super(message);
        
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.data = data;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    /**
     * Helper to serialize the error object into a clean JSON structure
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            data: this.data
        };
    }
}

module.exports = DoccenterError;