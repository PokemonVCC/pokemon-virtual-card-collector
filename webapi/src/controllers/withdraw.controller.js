const service = require('../services/withdraw.service');

async function get(req, res, next) {
    try{
        const pack = await service.withdrawPack();
        res.json({ 'message': pack });
    }
    catch (err) {
        console.error('Error on /withdraw [GET]');
        next(err);
    }
}

module.exports = {
    get
};