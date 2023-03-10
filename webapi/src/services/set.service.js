const mongo = require('./db.service');

const db = mongo.get();

async function getSet(id) {
    return await db.collection('sets').findOne({ id: id });
}

async function getSetTcgIdsByUserId(userId) {
    const setIds = [];
    const packs = await db.collection('packs').find({ user_id: userId }).toArray();

    for(let i = 0; i < packs.length; i++) {
        if(!setIds.includes(packs[i].set_tcg_id)) {
            setIds.push(packs[i].set_tcg_id);
        }
    }

    return setIds;
}

module.exports = {
    getSet,
    getSetTcgIdsByUserId
};