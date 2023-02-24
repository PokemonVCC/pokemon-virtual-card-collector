const env = process.env;
const db = {
    url: env.MONGODB_URL,
    user: env.MONGODB_USER,
    password: env.MONGODB_PASSWORD,
    database: env.MONGODB_DATABASE
};

module.exports = db;