const { DoccenterError } = require('../errors');

module.exports = async function getViewUrl(httpClient, documentId) {
    if (!documentId) {
        throw new DoccenterError('documentId is required to get view url', 400);
    }
    const response = await httpClient.get(`/docs/${documentId}/view-url`);
    return response.data.data;
};
