const { MongoClient, ServerApiVersion } = require('mongodb');
const crypto = require('crypto');
const dbConfig = require('../configs/db.config');

const uri = 'mongodb+srv://' + 
    dbConfig.user + ':' + 
    dbConfig.password + '@' +
    dbConfig.url + '/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

var _db;

async function connect() {
    try {
        await client.connect();
        _db = client.db(dbConfig.database);

        const collections = await (await _db.listCollections().toArray()).map(x => x.name);

        if(!collections.includes('logs')) {
            await _db.createCollection('logs', {
                capped: true,
                size: 30 * Math.pow(1024, 2) * 1000,
                max: 1000
            });
        }

        console.log('MongoDB connected!');
    }
    catch (err) {
        throw err;
    }
}

function get() {
    return _db;
}

function encryptString(textToEncrypt) {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(dbConfig.encryptedDataAlgo, dbConfig.encryptedDataKey, iv);

    const encrypted = Buffer.concat([cipher.update(textToEncrypt), cipher.final()]);
    
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
}

function decryptHash(hash) {
    const decipher = crypto.createDecipheriv(dbConfig.encryptedDataAlgo, dbConfig.encryptedDataKey, Buffer.from(hash.iv, 'hex'));

    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrypted.toString();
}

module.exports = {
    get,
    connect,
    encryptString,
    decryptHash
};