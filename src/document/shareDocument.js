const { DoccenterError } = require('../errors');

module.exports = async function shareDocument(httpClient, documentId, options = {}) {
    if (!documentId) {
        throw new DoccenterError('documentId is required to generate share url', 400);
    }
    const expiryTime = typeof options === 'number' ? options : (options?.expiryTime || 30);
    const response = await httpClient.post(`/docs/${documentId}/share`, { expiryTime: Number(expiryTime) });
    return response.data.data;
};
