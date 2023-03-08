const argon2 = require('argon2');
const crypto = require('crypto');
const constants = require('../constants/user.constant');
const withdrawConstants = require('../constants/withdraw.constant');
const mongo = require('./db.service');

const db = mongo.get();

async function getUser(id) {
    return await db.collection('users').findOne({ id: id });
}

async function createUser(username, password) {
    if(await db.collection('users').countDocuments({ username: username }) > 0) {
        return -1;
    }

    const passwordHash = await argon2.hash(password);

    const user = {
        id: crypto.randomBytes(64).toString('hex'),
        username: username,
        password: passwordHash,
        role: constants.roles.default,
        drop_points: withdrawConstants.dropPointsCost * 10,
        last_drop_points_update: new Date()
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

async function updateDropPoints(id, toSubtract) {
    const user = await db.collection('users').findOne({ id: id });
    
    if(!user) {
        return -1;
    }

    let dropPointsAmount = user.drop_points;
    
    if(!toSubtract) {
        const productionDate = new Date();
        const productionDiff = productionDate - user.last_drop_points_update;
        let minutesElapsed = productionDiff / 1000 / 60;

        if(minutesElapsed > constants.maxProductionTime) {
            minutesElapsed = constants.maxProductionTime;
        }
    
        const dropPointsProduced = minutesElapsed / 10;
    
        const dropPointsAmount = user.drop_points + dropPointsProduced;
        
        await db.collection('users').updateOne({ id: id }, { $set: { drop_points: dropPointsAmount, last_drop_points_update: productionDate }});
    }
    else {
        dropPointsAmount -= toSubtract;

        await db.collection('users').updateOne({ id: id }, { $set: { drop_points: dropPointsAmount }});
    }

    return dropPointsAmount;
}

module.exports = {
    getUser,
    createUser,
    updateUser,
    updateDropPoints
};