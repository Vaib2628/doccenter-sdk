const { DoccenterError } = require('../errors');

module.exports = async function deleteDocument(httpClient, documentId) {
    if (!documentId) {
        throw new DoccenterError('documentId is required to delete document', 400);
    }
    const response = await httpClient.delete(`/docs/${documentId}/document`);
    return response.data.data;
};
