const tokenStore = require('./tokenStore');

module.exports = async function refreshToken(httpClient) {
    const currentRefreshToken = tokenStore.getRefreshToken();
    if (!currentRefreshToken) {
        throw new Error('No refresh token available in tokenStore');
    }

    const response = await httpClient.post('/auth/refresh-access-token', {
        refreshToken: currentRefreshToken
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    tokenStore.setTokens({
        accessToken,
        refreshToken: newRefreshToken || currentRefreshToken
    });

    return accessToken;
};
