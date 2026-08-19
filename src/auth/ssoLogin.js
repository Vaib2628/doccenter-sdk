const tokenStore = require('./tokenStore');
const DoccenterError = require('../errors/DoccenterError');

/**
 * Performs Single Sign-On login by exchanging an SSO JWT token with the backend.
 * 
 * @param {import('axios').AxiosInstance} httpClient
 * @param {string} ssoToken - The signed JWT SSO token
 * @returns {Promise<{ user: object, slug: string, accessToken: string, refreshToken: string }>}
 */
module.exports = async function ssoLogin(httpClient, ssoToken) {
    if (!ssoToken) {
        throw new DoccenterError('ssoToken is required for SSO login', 400);
    }

    const response = await httpClient.post('/auth/sso', { ssoToken });
    const { accessToken, refreshToken, user, slug } = response.data.data;

    tokenStore.setTokens({ accessToken, refreshToken });

    return { user, slug, accessToken, refreshToken };
};
