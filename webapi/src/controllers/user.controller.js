const service = require('../services/user.service');

async function get(req, res, next) {
    try{
        const user = await service.getUser(req.params.id);
        
        if(!user) {
            res.status(404);
            res.json({ message: 'User not found '});
        }
        else {
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

    }
    catch (err) {
        console.error('Error on /user [POST]');
        next(err);
    }
}

async function put(req, res, next) {
    try{

    }
    catch (err) {
        console.error('Error on /user [PUT]');
        next(err);
    }
}

module.exports = {
    get,
    post,
    put
};