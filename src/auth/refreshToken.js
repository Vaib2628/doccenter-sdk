const tokenStore = require('./tokenStore');
const DoccenterError = require('../errors/DoccenterError');

/**
 * Refreshes the access token using the stored refresh token.
 * 
 * @param {import('axios').AxiosInstance} httpClient
 * @returns {Promise<string>} The new access token
 */
module.exports = async function refreshToken(httpClient) {
    const currentRefreshToken = tokenStore.getRefreshToken();
    if (!currentRefreshToken) {
        throw new DoccenterError('No refresh token available in tokenStore', 401);
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
