const { DoccenterError } = require('../errors');

module.exports = async function createFolder(httpClient, folderData) {
    const payload = typeof folderData === 'string' ? { name: folderData } : folderData;
    if (!payload || !payload.name) {
        throw new DoccenterError('Folder name is required to create a folder', 400);
    }
    const response = await httpClient.post('/docs/folder', payload);
    return response.data.data;
};
