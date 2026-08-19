let accessToken = null;
let refreshToken = null;
const listeners = new Set();

const notifyListeners = () => {
    const tokens = { accessToken, refreshToken };
    listeners.forEach((listener) => {
        try {
            listener(tokens);
        } catch (err) {
            console.error('Error in tokenStore listener:', err);
        }
    });
};

const tokenStore = {
    getAccessToken: () => accessToken,
    setAccessToken: (token) => {
        accessToken = token;
        notifyListeners();
    },

    getRefreshToken: () => refreshToken,
    setRefreshToken: (token) => {
        refreshToken = token;
        notifyListeners();
    },

    getTokens: () => ({ accessToken, refreshToken }),

    setTokens: ({ accessToken: access, refreshToken: refresh } = {}) => {
        if (access !== undefined) accessToken = access;
        if (refresh !== undefined) refreshToken = refresh;
        notifyListeners();
    },

    clear: () => {
        accessToken = null;
        refreshToken = null;
        notifyListeners();
    },

    onTokenChange: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }
};

module.exports = tokenStore;
