const mongo = require('./db.service');

const db = mongo.get();

async function createMetric(metric) {
    let acknowledged = false;
   
    metric.request.remote_ip = mongo.encryptString(metric.request.remote_ip);

    if(metric.request.body) {
        metric.request.body = mongo.encryptString(metric.request.body);
    }
    
    metric.response.body = mongo.encryptString(metric.response.body);

    do {
        try {
            const result = await db.collection('metrics').insertOne(metric);
            acknowledged = result.acknowledged;
        }
        catch {
            acknowledged = false;
        }
    } while (!acknowledged);
}

module.exports = {
    createMetric
};