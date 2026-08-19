module.exports = async function getProfile(httpClient) {
    const response = await httpClient.get('/users/me');
    return response.data.data;
};