const DoccenterError = require('./DoccenterError');

function normalizeError(error) {
    if (error instanceof DoccenterError) {
        return error;
    }

    // Server responded with an HTTP status outside 2xx
    if (error?.response) {
        const message = error.response.data?.message 
            || error.response.data?.error 
            || error.message 
            || 'Request failed with status code ' + error.response.status;
        const statusCode = error.response.status || 500;
        const data = error.response.data || null;

        return new DoccenterError(message, statusCode, data);
    }

    // Request was made but no response was received (Network / Timeout / DNS error)
    if (error?.request) {
        const message = error.code === 'ECONNABORTED' 
            ? 'Request timeout: The server took too long to respond'
            : (error.message || 'Network error: Unable to reach Doccenter server');

        return new DoccenterError(message, 0, { code: error.code });
    }

    return new DoccenterError(error?.message || 'An unexpected error occurred in Doccenter SDK', 500, null);
}

module.exports = normalizeError;
