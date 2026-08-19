const axios = require('axios');
const { DoccenterError } = require('../errors');

module.exports = async function uploadDocument(httpClient, fileContent, fileData = {}, options = {}) {
    if (!fileContent) {
        throw new DoccenterError('fileContent is required to upload a document', 400);
    }
    if (!fileData || !fileData.fileName) {
        throw new DoccenterError('fileName is required in fileData', 400);
    }

    const contentType = fileData.contentType || fileData.mimeType || fileData.fileType || 'application/octet-stream';
    const size = fileData.size ?? fileData.fileSize ?? (Buffer.isBuffer(fileContent) ? fileContent.length : 0);

    const payload = {
        fileName: fileData.fileName,
        contentType,
        size,
        folderId: fileData.folderId || null
    };

    const presignedRes = await httpClient.post('/docs/presigned-upload-url', payload);
    const { documentId, url, key } = presignedRes.data.data;

    try {
        const headers = options.headers || {};
        if (!headers['Content-Type']) {
            headers['Content-Type'] = contentType;
        }

        await axios.put(url, fileContent, {
            headers,
            onUploadProgress: options.onUploadProgress
        });
    } catch (err) {
        try {
            await httpClient.post(`/docs/${documentId}/failed`);
        } catch (_) {}

        throw new DoccenterError(
            err.message || 'Failed to upload document content to storage',
            err.response?.status || 500,
            err.response?.data || null
        );
    }

    const completeRes = await httpClient.post(`/docs/${documentId}/complete`);
    return {
        documentId,
        key,
        ...completeRes.data.data
    };
};
