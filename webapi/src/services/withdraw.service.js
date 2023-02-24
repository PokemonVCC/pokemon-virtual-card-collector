const tcgSdk = require('pokemontcgsdk');
const tcgConfig = require('../configs/tcg.config');
const constants = require('../constants/withdraw.constant');
const mongo = require('./db.service');

const db = mongo.get();

tcgSdk.configure({ apiKey: tcgConfig.key });

async function withdrawPack() {
    // Checks if a set already exists on database
    let set = await db.collection('sets').findOne({
        packs_available: {
            $gt: 0
        }
    });

    // No set found on database, needs to create a new one
    if(!set) {
        // Extracts one random set by probability
        set = getRandomSet();

        // Inserts the extracted set in the database
        const result = await db.collection('sets').insertOne({
            id: set.id,
            total_cards: set.cards,
            packs_available: 36
        });

        if(result.acknowledged) {
            // TODO: creare 36 pack da referenziare al set appena creato
            const setCards = await tcgSdk.card.all({ q: 'set.id:' + set.id });
            const canHaveSecretRare = Math.random() <= (1 / 72);

            for(let i = 0; i < 36; i++) {
                const pack = {
                    set_id: result.insertedId,
                    cards: []
                };

                let j = 0;

                while(j < 10) {
                    let card;

                    while(!card)
                    {
                        if(j < 6) {
                            const commonCards = setCards.filter(x => x.rarity === 'Common');
                            card = commonCards[Math.floor(Math.random() * commonCards.length)];
                        }
                        else if(j < 8) {
                            const uncommonCards = setCards.filter(x => x.rarity === 'Uncommon');
                            card = uncommonCards[Math.floor(Math.random() * uncommonCards.length)];
                        }
                        else {
                            let filteredCards = [];
                            
                            while(filteredCards.length === 0) {
                                const rarity = getRandomRarity();

                                if(rarity === 'Rare Secret' && !canHaveSecretRare) {
                                    continue;
                                }

                                filteredCards = setCards.filter(x => x.rarity === rarity.name);
                            }
                            
                            card = filteredCards[Math.floor(Math.random() * filteredCards.length)];
                        }

                        if(pack.cards.filter(x => x.id === card.id).length === 0) {
                            pack.cards.push({
                                id: card.id,
                                name: card.name,
                                number: card.number,
                                rarity: card.rarity,
                                images: {
                                    small: card.images.small,
                                    large: card.images.large
                                }
                            });
                        }
                        else {
                            card = null;
                        }
                    }

                    j++;
                }

                db.collection('packs').insertOne(pack);
            }
        }
    }

    console.log(set);
}

function getRandomSet() {
    let sum = 0;

    constants.sets.forEach(set => {
        sum += set.probability;
    });

    let pick = Math.random() * sum;
    
    const orderedSets = constants.sets
        .sort((a, b) => b.probability - a.probability);

    for(let i = 0; i < orderedSets.length; i++) {
        pick -= orderedSets[i].probability;

        if(pick <= 0) {
            return orderedSets[i];
        }
    }
}

function getRandomRarity() {
    let sum = 0;

    constants.rarities.forEach(rarity => {
        sum += rarity.probability;
    });

    let pick = Math.random() * sum;
    
    const orderedRarities = constants.rarities
        .sort((a, b) => b.probability - a.probability);

    for(let i = 0; i < orderedRarities.length; i++) {
        pick -= orderedRarities[i].probability;

        if(pick <= 0) {
            return orderedRarities[i];
        }
    }
}

module.exports = {
    withdrawPack
};