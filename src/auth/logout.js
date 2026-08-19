const tokenStore = require('./tokenStore');

module.exports = async function logout(httpClient) {
    try {
        if (tokenStore.getAccessToken()) {
            await httpClient.post('/auth/logout');
        }
    } finally {
        tokenStore.clear();
    }
};
