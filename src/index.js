const createHttpClient = require('./HttpClient');
const createAuthModule = require('./auth');
const createDocumentModule = require('./document');
const { DoccenterError } = require('./errors');

class Doccenter {
    constructor(config) {
        this.httpClient = createHttpClient(config);
        this.auth = createAuthModule(this.httpClient);
        this.documents = createDocumentModule(this.httpClient);
        this.document = this.documents;
    }
}

module.exports = Doccenter;
module.exports.Doccenter = Doccenter;
module.exports.DoccenterError = DoccenterError;
