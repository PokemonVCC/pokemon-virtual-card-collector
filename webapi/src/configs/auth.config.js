const env = process.env;
const auth = {
    tokenKey: env.AUTH_TOKEN_KEY,
    tokenExpirationDays: '7d'
};

module.exports = auth;