module.exports = async function getDocuments(httpClient, params = {}) {
    const response = await httpClient.get('/docs', { params });
    return response.data.data;
};
