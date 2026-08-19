const getDocuments = require('./getDocuments');
const uploadDocument = require('./uploadDocument');
const getViewUrl = require('./getViewUrl');
const getDownloadUrl = require('./getDownloadUrl');
const shareDocument = require('./shareDocument');
const updateDocument = require('./updateDocument');
const deleteDocument = require('./deleteDocument');
const createFolder = require('./createFolder');

module.exports = function createDocumentModule(httpClient) {
    return {
        list: (params) => getDocuments(httpClient, params),
        upload: (fileContent, fileData, options) => uploadDocument(httpClient, fileContent, fileData, options),
        getViewUrl: (documentId) => getViewUrl(httpClient, documentId),
        getDownloadUrl: (documentId) => getDownloadUrl(httpClient, documentId),
        share: (documentId, options) => shareDocument(httpClient, documentId, options),
        update: (documentId, data) => updateDocument(httpClient, documentId, data),
        delete: (documentId) => deleteDocument(httpClient, documentId),
        createFolder: (folderData) => createFolder(httpClient, folderData)
    };
};
