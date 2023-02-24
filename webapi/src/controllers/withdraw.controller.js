const tcgsdk = require('pokemontcgsdk');
// const service = require('');


async function get(req, res, next) {
    try{
        // const sets = await tcgsdk.set.all();

        res.json({ 'message': 'withdraw' });
    }
    catch (err) {
        console.error('Error on /withdraw [GET]');
        next(err);
    }
}

module.exports = {
    get
};