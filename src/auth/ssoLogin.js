const tokenStore = require('./tokenStore');

module.exports = async function ssoLogin(httpClient, ssoToken) {
    if (!ssoToken) throw new Error('ssoToken is required for SSO login');

    const response = await httpClient.post('/auth/sso', { ssoToken });
    const { accessToken, refreshToken, user, slug } = response.data.data;

    tokenStore.setTokens({ accessToken, refreshToken });

    return { user, slug, accessToken, refreshToken };
};
