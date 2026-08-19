const { DoccenterError } = require('../errors');

module.exports = async function createFolder(httpClient, folderData) {
    if (!folderData || !folderData.name) {
        throw new DoccenterError('Folder name is required to create a folder', 400);
    }
    const response = await httpClient.post('/docs/folder', folderData);
    return response.data.data;
};
