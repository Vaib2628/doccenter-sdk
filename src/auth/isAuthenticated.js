const tokenStore = require('./tokenStore');

module.exports = () => Boolean(tokenStore.getAccessToken());
