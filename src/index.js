const createHttpClient = require('./HttpClient');
const createAuthModule = require('./auth');
const DoccenterError = require('./errors/DoccenterError');

class Doccenter {
    /**
     * @param {string | { apiKey: string, baseURL?: string }} config
     */
    constructor(config) {
        this.httpClient = createHttpClient(config);
        this.auth = createAuthModule(this.httpClient);
    }
}

module.exports = Doccenter;
module.exports.Doccenter = Doccenter;
module.exports.DoccenterError = DoccenterError;
