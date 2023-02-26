const mongo = require('./db.service');

const db = mongo.get();

async function getCard(id) {
    return await db.collection('cards').findOne({ id: id });
}

module.exports = {
    getCard
};