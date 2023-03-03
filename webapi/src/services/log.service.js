const mongo = require('./db.service');

const db = mongo.get();

async function createLog(log) {
    let acknowledged = false;
   
    log.request.remote_ip = mongo.encryptString(log.request.remote_ip);

    if(log.request.body) {
        log.request.body = mongo.encryptString(log.request.body);
    }

    do {
        try {
            const result = await db.collection('logs').insertOne(log);
            acknowledged = result.acknowledged;
        }
        catch {
            acknowledged = false;
        }
    } while (!acknowledged);
}

module.exports = {
    createLog
};