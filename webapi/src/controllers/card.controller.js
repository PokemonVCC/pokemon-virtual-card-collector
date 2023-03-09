const service = require('../services/card.service');

async function getById(req, res, next) {
    try{
        if(!req.params.id) {
            res.status(400);
            res.json({ message: 'Missing card id' });
            return;
        }

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

async function pointsByUserIdAndSetTcgId(req, res, next) {
    try {
        if(!req.params.user_id ||
            !req.params.set_tcg_id) {
            res.status(400);
            res.json({ message: 'Missing required parameters' });
            return;
        }

        const packs = await service.getPacksByUserIdAndSetTcgId(req.params.user_id, req.params.set_tcg_id);

        if(packs.length === 0) {
            res.status(404);
            res.json({ message: 'No cards found' });
            return;
        }

        const setIds = [];
        let cardsPoints = 0;
        let onePointCards = 0;
        let threePointCards = 0;
        let fivePointCards = 0;

        for(let i = 0; i < packs.length; i++) {
            const pack = packs[i];

            if(!setIds.includes(pack.set_id)) {
                setIds.push(pack.set_id);

                const cards = await service.getCardsByUserIdAndSetId(req.params.user_id, pack.set_id);

                for(let j = 0; j < cards.length; j++) {
                    const card = cards[j];

                    switch(card.points) {
                        case 1:
                            onePointCards++;
                            break;
                        case 3:
                            threePointCards++;
                            break;
                        case 5:
                            fivePointCards++;
                            break;
                    }

                    cardsPoints += card.points;
                }
            }
        }

        const result = {
            total: cardsPoints,
            one_point_count: onePointCards,
            three_points_count: threePointCards,
            five_points_count: fivePointCards
        };

        res.json({ data: result });
    }
    catch (err) {
        console.error('Error on /card/me [GET]');
        next(err);
    }
}

async function valueByUserIdAndSetTcgId(req, res, next) {
    try {
        if(!req.params.user_id ||
            !req.params.set_tcg_id) {
            res.status(400);
            res.json({ message: 'Missing required parameters' });
            return;
        }

        const packs = await service.getPacksByUserIdAndSetTcgId(req.params.user_id, req.params.set_tcg_id);

        if(packs.length === 0) {
            res.status(404);
            res.json({ message: 'No cards found' });
            return;
        }

        const setIds = [];
        let cardsValue = 0;
        let cardsMaxValue = Number.MIN_VALUE;
        let cardsMinValue = Number.MAX_VALUE;
        let cardsCount = 0;

        for(let i = 0; i < packs.length; i++) {
            const pack = packs[i];

            if(!setIds.includes(pack.set_id)) {
                setIds.push(pack.set_id);

                const cards = await service.getCardsByUserIdAndSetId(req.params.user_id, pack.set_id);

                for(let j = 0; j < cards.length; j++) {
                    const card = cards[j];

                    if(card.value > cardsMaxValue) {
                        cardsMaxValue = card.value;
                    }

                    if(card.value < cardsMinValue) {
                        cardsMinValue = card.value;
                    }

                    cardsValue += card.value;
                }

                cardsCount += cards.length;
            }
        }

        const result = {
            total: parseFloat(cardsValue.toFixed(2)),
            max: parseFloat(cardsMaxValue.toFixed(2)),
            min: parseFloat(cardsMinValue.toFixed(2)),
            avg: parseFloat((cardsValue / cardsCount).toFixed(2))
        };

        res.json({ data: result });
    }
    catch (err) {
        console.error('Error on /card/me [GET]');
        next(err);
    }
}

async function countByUserIdAndSetTcgId(req, res, next) {
    try {
        if(!req.params.user_id ||
            !req.params.set_tcg_id) {
            res.status(400);
            res.json({ message: 'Missing required parameters' });
            return;
        }

        const packs = await service.getPacksByUserIdAndSetTcgId(req.params.user_id, req.params.set_tcg_id);

        if(packs.length === 0) {
            res.status(404);
            res.json({ message: 'No cards found' });
            return;
        }

        const set = await service.getSetById(packs[packs.length - 1].set_id);
        const count = await service.countCardsByUserIdAndPackIds(req.params.user_id, packs.map(x => x.id));

        const result = {
            total: set.total_cards,
            found: count
        };

        res.json({ data: result });
    }
    catch (err) {
        console.error('Error on /card/me [GET]');
        next(err);
    }
}

async function getByUserIdAndSetTcgId(req, res, next) {
    try {
        if(!req.params.user_id ||
            !req.params.set_tcg_id) {
            res.status(400);
            res.json({ message: 'Missing required parameters' });
            return;
        }

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
                    result.set.secret_cards = set.total_cards - set.printed_cards;
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
                        value: card.value,
                        points: card.points,
                        rarity: card.rarity,
                        is_reverse: card.is_reverse,
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

                        if(card.is_reverse) {
                            reference.is_reverse = true;
                        }
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
    pointsByUserIdAndSetTcgId,
    valueByUserIdAndSetTcgId,
    countByUserIdAndSetTcgId,
    getByUserIdAndSetTcgId
};