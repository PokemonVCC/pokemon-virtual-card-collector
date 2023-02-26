const service = require('../services/withdraw.service');

async function get(req, res, next) {
    try{
        const pack = await service.withdrawPack();
        
        let test = '<html><body style="margin:0">';
        test += '<div style="width:900px;margin:auto;text-align:center;margin-top:20px"><img src="' + pack.images.logo + '">';
        test += '<h1>' + pack.id.split('-')[0] + '(' + pack.id + ')</h1></div>';
        test += '<div style="display:grid;grid-template-columns:240px 240px 240px 240px 240px;grid-column-gap:20px;grid-row-gap:20px;width:1280px;margin:auto">';

        for(let i = 0; i < pack.cards.length; i++) {
            test += '<div><u>' + pack.cards[i].id + '</u><br/><b>' + pack.cards[i].name + '</b><br/><i>' + pack.cards[i].rarity + '</i><br/>';
            test += '<img src="' + pack.cards[i].images.small + '"></div>';
        }

        test += '</div></body></html>';

        res.send(test);
    }
    catch (err) {
        console.error('Error on /withdraw [GET]');
        next(err);
    }
}

module.exports = {
    get
};