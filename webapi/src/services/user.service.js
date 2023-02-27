const argon2 = require('argon2');
const hashUtils = require('../utils/hash.utils');
const constants = require('../constants/user.constant');
const mongo = require('./db.service');

const db = mongo.get();

async function getUser(id) {
    return await db.collection('users').findOne({ id: id });
}

async function createUser(username, password) {
    if(await db.collection('users').countDocuments({ username: username }) > 0) {
        return -1;
    }

    const userId = username;
    const userHash = await argon2.hash(userId, {
        type: argon2.argon2id,
        timeCost: 2,
        hashLength: 16,
        raw: true
    });

    const passwordHash = await argon2.hash(password);

    const user = {
        id: hashUtils.hashToHex(userHash),
        username: username,
        password: passwordHash,
        role: constants.roles.default
    };

    const result = await db.collection('users').insertOne(user);
    
    if(result.acknowledged) {
        return user;
    }

    return -2;
}

async function updateUser(id, oldPassword, password) {
    const user = await db.collection('users').findOne({ id: id });

    if(!user) {
        return -1;
    }

    if(!await argon2.verify(user.password, oldPassword)) {
        return -2;
    }

    const passwordHash = await argon2.hash(password);

    const result = await db.collection('users').updateOne({ id: id }, { $set: { password: passwordHash }});

    if(result.acknowledged) {
        return user;
    }

    return -3;
}

module.exports = {
    getUser,
    createUser,
    updateUser
};