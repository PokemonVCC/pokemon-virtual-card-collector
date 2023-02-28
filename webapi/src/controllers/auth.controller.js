const service = require('../services/auth.service');
const userUtils = require('../utils/user.utils');

async function post(req, res, next) {
    try {
        if(!req.body.username ||
            !req.body.password) {
            res.status(400);
            res.json({ message: 'Missing required parameters' });
            return;
        }

        const token = await service.authenticateUser(req.body.username, req.body.password);

        if(token === -1) {
            res.status(401);
            res.json({ message: 'Invalid credentials' });
            return;
        }
        else if(token === -2) {
            res.status(500);
            res.json({ message: 'Something went bad during user update' });
            return;
        }

        res.json({ data: token });
    }
    catch (err) {
        console.error('Error on /auth [POST]');
        next(err);
    }
}

module.exports = {
    post
};