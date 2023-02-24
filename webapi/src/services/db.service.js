const { MongoClient, ServerApiVersion } = require('mongodb');
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
        console.log('MongoDB connected!');
    }
    catch (err) {
        throw err;
    }
}

function get() {
    return _db;
}

module.exports = {
    get,
    connect
};