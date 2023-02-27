const service = require('../services/user.service');
const userUtils = require('../utils/user.utils');

async function get(req, res, next) {
    try{
        if(!req.params.id) {
            res.status(400);
            res.json({ message: 'Missing ":id" parameter '});
            return;
        }

        const user = await service.getUser(req.params.id);
        
        if(!user) {
            res.status(404);
            res.json({ message: 'User not found' });
        }
        else {
            userUtils.hideUserConfidentialData(user);
            res.json({ data: user });     
        }
    }
    catch (err) {
        console.error('Error on /user/:id [GET]');
        next(err);
    }
}

async function post(req, res, next) {
    try{
        if(!req.body.username ||
            !req.body.password) {
            res.status(400);
            res.json({ message: 'Missing required parameters' });
            return;
        }
        else if(req.body.username === '' ||
            req.body.username.length < 4) {
            res.status(400);
            res.json({ message: 'Username must have at least 4 characters' });
            return;
        }
        else if(req.body.password === '' ||
            req.body.password.length < 8) {
            res.status(400);
            res.json({ message: 'Password must have at least 8 characters' });
            return;
        }
        
        const user = await service.createUser(req.body.username, req.body.password);

        if(user === -1) {
            res.status(400);
            res.json({ message: 'Username already taken' });
            return;
        }
        else if(user === -2) {
            res.status(500);
            res.json({ message: 'Something went bad during user creation' });
            return;
        }

        userUtils.hideUserConfidentialData(user);

        res.json({ data: user });
    }
    catch (err) {
        console.error('Error on /user [POST]');
        next(err);
    }
}

async function put(req, res, next) {
    try{
        if(!req.body.old_password ||
            !req.body.password) {
            res.status(400);
            res.json({ message: 'Missing required parameters' });
            return;
        }
        else if(req.body.old_password === '' ||
            req.body.old_password.length < 8) {
            res.status(400);
            res.json({ message: 'Old password is not valid' });
            return;
        }
        else if(req.body.password === '' ||
            req.body.password.length < 8) {
            res.status(400);
            res.json({ message: 'Password must have at least 8 characters' });
            return;
        }

        const user = await service.updateUser(req.authenticatedUser.id, req.body.old_password, req.body.password);

        if(user === -1) {
            res.status(404);
            res.json({ message: 'User not found '});
            return;
        }
        else if(user === -2) {
            res.status(403);
            res.json({ message: 'Password validity-check failed' });
            return;
        }
        else if(user === -3) {
            res.status(500);
            res.json({ message: 'Something went bad during user update' });
            return;
        }

        userUtils.hideUserConfidentialData(user);

        res.json({ data: user });
    }
    catch (err) {
        console.error('Error on /user/:id [PUT]');
        next(err);
    }
}

function checkEmailValidity(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

module.exports = {
    get,
    post,
    put
};