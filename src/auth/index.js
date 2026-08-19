const ssoLogin = require('./ssoLogin');
const refreshToken = require('./refreshToken');
const isAuthenticated = require('./isAuthenticated');
const getProfile = require('./getProfile');
const logout = require('./logout');
const tokenStore = require('./tokenStore');

module.exports = function createAuthModule(httpClient) {
    return {
        ssoLogin: (ssoToken) => ssoLogin(httpClient, ssoToken),
        refreshToken: () => refreshToken(httpClient),
        isAuthenticated,
        getProfile: () => getProfile(httpClient),
        logout: () => logout(httpClient),
        setSession: ({ accessToken, refreshToken } = {}) => {
            tokenStore.setTokens({ accessToken, refreshToken });
        },
        getTokens: () => tokenStore.getTokens(),
        onTokenChange: (listener) => tokenStore.onTokenChange(listener),
        tokenStore
    };
};
