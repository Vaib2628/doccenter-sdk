const { DoccenterError } = require('../errors');

module.exports = async function getDownloadUrl(httpClient, documentId) {
    if (!documentId) {
        throw new DoccenterError('documentId is required to get download url', 400);
    }
    const response = await httpClient.get(`/docs/${documentId}/download`);
    return response.data.data;
};
