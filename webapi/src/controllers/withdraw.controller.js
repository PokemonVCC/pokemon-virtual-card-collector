const service = require('../services/withdraw.service');

async function get(req, res, next) {
    try{
        // TODO: check if user credits are enough
        const pack = await service.withdrawPack(req.authenticatedUser.id);
        
        // let test = '<html><body style="margin:0">';
        // test += '<div style="width:900px;margin:auto;text-align:center;margin-top:20px"><img src="' + pack.images.logo + '">';
        // test += '<h3>' + pack.id + '</h3></div>';
        // test += '<div style="display:grid;grid-template-columns:260px 260px 260px 260px 260px;grid-column-gap:20px;grid-row-gap:20px;width:1380px;margin:auto">';

        // for(let i = 0; i < pack.cards.length; i++) {
        //     test += '<div><u>' + pack.cards[i].id + '</u><br/><b>' + pack.cards[i].name + '</b><br/><i>' + pack.cards[i].rarity + '</i><br/>';
        //     test += '<img src="' + pack.cards[i].images.small + '"></div>';
        // }

        // test += '</div></body></html>';

        // res.send(test);
        if(!pack) {
            res.status(404);
            res.json({ message: 'Pack not found' });
            return;
        }

        res.json({ data: pack });
    }
    catch (err) {
        console.error('Error on /withdraw [GET]');
        next(err);
    }
}

module.exports = {
    get
};