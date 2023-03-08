const mongo = require('./db.service');

const db = mongo.get();

async function getCard(id) {
    return await db.collection('cards').findOne({ id: id });
}

async function getPacksByUserIdAndSetTcgId(userId, setTcgId) {
    return await db.collection('packs').find({ user_id: userId, set_tcg_id: setTcgId }).toArray();
}

async function getCardsByUserIdAndSetId(userId, setId) {
    return await db.collection('cards').find({ user_id: userId, set_id: setId }).toArray();
}

async function getSetById(setId) {
    return await db.collection('sets').findOne({ id: setId });
}

async function countCardsByUserIdAndPackIds(userId, packIds) {
    return (await db.collection('cards').distinct('number', { user_id: userId, pack_id: { $in: packIds } })).length;
}

module.exports = {
    getCard,
    getPacksByUserIdAndSetTcgId,
    getCardsByUserIdAndSetId,
    getSetById,
    countCardsByUserIdAndPackIds
};