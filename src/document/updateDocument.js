const { DoccenterError } = require('../errors');

module.exports = async function updateDocument(httpClient, documentId, data) {
    if (!documentId) {
        throw new DoccenterError('documentId is required to update document', 400);
    }
    const response = await httpClient.put(`/docs/${documentId}/document`, data);
    return response.data.data;
};
