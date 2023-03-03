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

        const result = [];

        let setMongoIds = [];
        let packIds = [...new Set(allCards.map(x => x.pack_id))];
        let setIds = {};
        
        for(let i = 0; i < packIds.length; i++) {
            const pack = await service.getCardPack(packIds[i]);

            if(setMongoIds.filter(x => x.equals(pack.set_id)).length === 0) {
                const set = await service.getCardSet(pack.set_id);

                if(result.filter(x => x.set_id === set.id).length === 0) {
                    result.push({
                        set_id: set.id,
                        set_images: pack.images,
                        packIds: [pack.id],
                        cards: []
                    });
                }

                setMongoIds.push(pack.set_id);
                setIds[pack.set_id] = set.id;
            }
            else {
                result.find(x => x.set_id === setIds[pack.set_id]).packIds.push(pack.id);
            }
        }

        setMongoIds = null;
        packIds = null;
        setIds = null;
        
        for(let i = 0; i < result.length; i++) {
            const cards = allCards.filter(x => result[i].packIds.includes(x.pack_id));
            
            for(let j = 0; j < cards.length; j++) {
                const card = cards[j];

                if(result[i].cards.filter(x => parseInt(x.number) === parseInt(card.number)).length === 0) {
                    result[i].cards.push({
                        ids: [card.id],
                        name: card.name,
                        number: parseInt(card.number),
                        rarity: card.rarity,
                        types: card.types,
                        weaknesses: card.weaknesses,
                        resistances: card.resistances,
                        images: card.images,
                        amount: 1
                    });
                }
                else {
                    const reference = result[i].cards.find(x => parseInt(x.number) === parseInt(card.number));

                    reference.amount++;
                    reference.ids.push(card.id);
                }
            }

            result[i].cards.sort((a, b) => a.number - b.number);
            
            delete result[i].packIds;
        }
        
        res.json({ data: result.sort((a, b) => a.set_id - b.set_id) });
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