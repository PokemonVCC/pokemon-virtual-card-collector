const service = require('../services/card.service');

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

async function getByUserIdAndSetTcgId(req, res, next) {
    try {
        const packs = await service.getPacksByUserIdAndSetTcgId(req.params.user_id, req.params.set_tcg_id);

        if(packs.length === 0) {
            res.status(404);
            res.json({ message: 'No cards found' });
            return;
        }

        const setIds = [];
        
        const result = {
            set: {
                images: packs[0].images,
                ids: []
            },
            packs_ids: [],
            cards: []
        };

        for(let i = 0; i < packs.length; i++) {
            const pack = packs[i];

            result.packs_ids.push(pack.id);

            if(!setIds.includes(pack.set_id)) {
                setIds.push(pack.set_id);
                
                const set = await service.getSetById(pack.set_id);
                
                if(!result.set.total_cards) {
                    result.set.total_cards = set.total_cards;
                }

                result.set.ids.push(set.id);
            }
        }

        for(let i = 0; i < setIds.length; i++) {
            const cards = await service.getCardsByUserIdAndSetId(req.params.user_id, setIds[i]);

            for(let j = 0; j < cards.length; j++) {
                const card = cards[j];

                if(result.cards.filter(x => x.number === card.number).length === 0) {
                    result.cards.push({
                        amount: 1,
                        ids: [card.id],
                        images: card.images,
                        name: card.name,
                        number: parseInt(card.number),
                        points: card.points,
                        rarity: card.rarity,
                        resistances: card.resistances,
                        types: card.types,
                        weaknesses: card.weaknesses,
                    });
                }
                else {
                    const reference = result.cards.find(x => x.number === card.number);

                    if(reference) {
                        reference.ids.push(card.id);
                        reference.amount++;
                    }
                }
            }
        }

        result.packs_count = result.packs_ids.length;
        result.cards = result.cards.sort((a, b) => a.number - b.number);
        result.cards_count = result.cards.length;

        res.json({ data: result });
    }
    catch (err) {
        console.error('Error on /card/me [GET]');
        next(err);
    }
}

module.exports = {
    getById,
    getByUserIdAndSetTcgId
};