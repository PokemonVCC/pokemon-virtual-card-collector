const service = require('../services/card.service');
const cardUtils = require('../utils/card.utils');

async function getById(req, res, next) {
    try{
        const card = await service.getCard(req.params.id);
        
        if(!card) {
            res.status(404);
            res.json({ message: 'Card not found '});
        }
        else {
            res.json(card);     
        }
    }
    catch (err) {
        console.error('Error on /card/:id [GET]');
        next(err);
    }
}

async function getByUser(req, res, next) {
    try {
        const allCards = await service.getCards({
            user_id: req.authenticatedUser.id
        });

        if(allCards.length === 0) {
            res.status(404);
            res.json({ message: 'No cards found' });
            return;
        }

        const cards = [];
        const packs = [];
        const sets = [];

        for(let i = 0; i < allCards.length; i++) {
            const card = allCards[i];
            let pack;
            let set;

            if(packs.filter(x => x.id === card.pack_id).length === 0) {
                pack = await service.getCardPack(card.pack_id);
                packs.push(pack);
            }
            else {
                pack = packs.find(x => x.id === card.pack_id);
            }
            
            if(!pack) {
                continue;
            }
            
            if(sets.filter(x => x._id.equals(pack.set_id)).length === 0) {
                set = await service.getCardSet(pack.set_id);
                sets.push(set);
            }
            else {
                set = sets.find(x => x._id.equals(pack.set_id));
            }

            if(!set) {
                continue;
            }

            const tempId = set.id + card.number;

            if(cards.filter(x => x.temp_id === tempId).length === 0) {
                cards.push({
                    temp_id: tempId,
                    set_id: set.id,
                    ids: [card.id],
                    name: card.name,
                    number: parseInt(card.number),
                    rarity: card.rarity,
                    types: card.types,
                    weaknesses: card.weaknesses,
                    resistances: card.resistances,
                    images: card.images,
                    pack_images: pack.images,
                    amount: 1
                });
            }
            else {
                const reference = cards.find(x => x.temp_id === tempId);
                reference.amount++;
                reference.ids.push(card.id);
            }
        }

        for(let i = 0; i < cards.length; i++) {
            delete cards[i].temp_id;
        }

        res.json({ count: cards.length, data: cards.sort((a, b) => a.number - b.number || a.set_id === b.set_id) });
    }
    catch (err) {
        console.error('Error on /card/me [GET]');
        next(err);
    }
}

module.exports = {
    getById,
    getByUser
};