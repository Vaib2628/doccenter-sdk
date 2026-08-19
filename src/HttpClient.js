const axios = require('axios');
const tokenStore = require('./auth/tokenStore');
const refreshToken = require('./auth/refreshToken');
const { DoccenterError, normalizeError } = require('./errors');

module.exports = function createHttpClient(options) {
    const apiKey = typeof options === 'string' ? options : options?.apiKey;
    const baseURL = (typeof options === 'object' && options?.baseURL) 
        ? options.baseURL 
        : 'http://localhost:3000/api/v1';
    const timeout = (typeof options === 'object' && options?.timeout) 
        ? options.timeout 
        : 30000;

    if (!apiKey) {
        throw new DoccenterError('API key is required to initialize Doccenter client', 400);
    }

    const client = axios.create({
        baseURL,
        timeout,
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
        }
    });

    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, token = null) => {
        failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(normalizeError(error));
            } else {
                resolve(token);
            }
        });
        failedQueue = [];
    };

    // Request Interceptor: Attach Access Token
    client.interceptors.request.use(
        (config) => {
            const accessToken = tokenStore.getAccessToken();
            if (accessToken) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(normalizeError(error))
    );

    // Response Interceptor: 401 Auto-refresh & DoccenterError wrapping
    client.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (!originalRequest || error.response?.status !== 401) {
                return Promise.reject(normalizeError(error));
            }

            const isRefreshRequest = originalRequest.url?.includes('/auth/refresh-access-token');
            if (originalRequest._retry || isRefreshRequest) {
                tokenStore.clear();
                return Promise.reject(normalizeError(error));
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return client(originalRequest);
                    })
                    .catch((err) => Promise.reject(normalizeError(err)));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshToken(client);
                processQueue(null, newToken);

                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return client(originalRequest);
            } catch (refreshError) {
                const normalizedRefreshError = normalizeError(refreshError);
                processQueue(normalizedRefreshError, null);
                tokenStore.clear();
                return Promise.reject(normalizedRefreshError);
            } finally {
                isRefreshing = false;
            }
        }
    );

    return client;
};
