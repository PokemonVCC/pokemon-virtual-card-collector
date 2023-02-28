const mongo = require('./db.service');

const db = mongo.get();

async function getCard(id) {
    return await db.collection('cards').findOne({ id: id });
}

async function getCards(filter) {
    return await db.collection('cards').find(filter).toArray();
}

async function getCardPack(packId) {
    return await db.collection('packs').findOne({ id: packId });
}

async function getCardSet(setId) {
    return await db.collection('sets').findOne({ _id: setId });
}

module.exports = {
    getCard,
    getCards,
    getCardPack,
    getCardSet
};