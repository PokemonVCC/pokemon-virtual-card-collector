const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const authConfig = require('../configs/auth.config');
const mongo = require('./db.service');

const db = mongo.get();

async function authenticateUser(username, password) {
    const user = await db.collection('users').findOne({ username: username });

    if(!user) {
        return -1;
    }

    if(!await argon2.verify(user.password, password)) {
        return -1;
    }

    const token = jwt.sign({ 
            id: user.id, 
            username: user.username 
        }, authConfig.tokenKey, {
          expiresIn: authConfig.tokenExpirationDays 
        });

    user.token = token;

    const result = await db.collection('users').updateOne({ id: user.id }, { $set: { last_login: new Date() }});

    if(result.acknowledged) {
        return user;
    }

    return -2;
}

module.exports = {
    authenticateUser
};