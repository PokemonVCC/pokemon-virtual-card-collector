const env = process.env;
const db = {
    url: env.MONGODB_URL,
    user: env.MONGODB_USER,
    password: env.MONGODB_PASSWORD,
    database: env.MONGODB_DATABASE,
    encryptedDataAlgo: env.MONGODB_ENCRYPT_DECRYPT_ALGO,
    encryptedDataKey: env.MONGODB_ENCRYPT_DECRYPT_KEY
};

module.exports = db;