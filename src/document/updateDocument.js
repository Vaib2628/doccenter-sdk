const { DoccenterError } = require('../errors');

module.exports = async function updateDocument(httpClient, documentId, data) {
    if (!documentId) {
        throw new DoccenterError('documentId is required to update document', 400);
    }
    const payload = typeof data === 'string' ? { name: data } : data;
    if (!payload || !payload.name) {
        throw new DoccenterError('Document name is required', 400);
    }

    const response = await httpClient.put(`/docs/${documentId}/document`, payload);
    return response.data.data;
};
