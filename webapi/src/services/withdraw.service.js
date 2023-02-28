const tcgSdk = require('pokemontcgsdk');
const argon2 = require('argon2');
const hashUtils = require('../utils/hash.utils');
const tcgConfig = require('../configs/tcg.config');
const constants = require('../constants/withdraw.constant');
const mongo = require('./db.service');

const db = mongo.get();

tcgSdk.configure({ apiKey: tcgConfig.key });

async function withdrawPack(userId) {
    // Checks if a set already exists on database
    let set = await db.collection('sets').findOne({
        packs_available: {
            $gt: 0
        }
    });

    // No set found on database, needs to create a new one
    if(!set) {
        set = await generateNewSet();
    }

    const packs = await db.collection('packs')
        .find({ set_id: set._id, withdrawed: false })
        .toArray();
    const pack = packs[Math.floor(Math.random() * packs.length)];

    const cards = await db.collection('cards').find({ pack_id: pack.id }).toArray();

    for(let i = 0; i < cards.length; i++) {
        await db.collection('cards').updateOne({ _id: cards[i]._id }, { $set: { user_id: userId }});
    }

    await db.collection('packs').updateOne({ _id: pack._id }, { $set: { user_id: userId, withdrawed: true }});
    await db.collection('sets').updateOne({ _id: set._id }, { $set: { packs_available: set.packs_available - 1 }});

    pack.cards = cards;

    return pack;
}

async function generateNewSet() {
    // Extracts one random set by probability
    const setExtracted = getRandomSet();

    const set = {
        id: setExtracted.id,
        total_cards: setExtracted.cards,
        packs_available: 36
    };

    // Inserts the extracted set in the database
    const setResult = await db.collection('sets').insertOne(set);

    if(setResult.acknowledged) {
        set._id = setResult.insertedId;

        const setApiResult = await tcgSdk.set.find(set.id);
        const setCards = await tcgSdk.card.all({ q: 'set.id:' + set.id });

        const linkedSet = constants.setsLinked.filter(x => x.origin === set.id);
        if(linkedSet.length === 1) {
            const linkedCards = await tcgSdk.card.all({ q: 'set.id:' + linkedSet[0].linked });
            
            for(let i = 0; i < linkedCards.length; i++) {
                setCards.push(linkedCards[i]);
            }
        }

        const canHaveSecretRare = Math.random() <= (1 / 72);
        const setRarities = [...new Set(setCards.map(x => x.rarity))];
        
        for(let i = 0; i < 36; i++) {
            let j = 0;
            let packCardsPool = setCards;
            
            const cards = [];

            while(j < 10) {
                let card;

                if(j < 6) {
                    const commonCards = packCardsPool.filter(x => x.rarity === 'Common');
                    card = commonCards[Math.floor(Math.random() * commonCards.length)];
                }
                else if(j < 9) {
                    const uncommonCards = packCardsPool.filter(x => x.rarity === 'Uncommon');
                    card = uncommonCards[Math.floor(Math.random() * uncommonCards.length)];
                }
                else {
                    let filteredCards = [];
                    
                    while(filteredCards.length === 0) {
                        const rarity = getRandomRarity(setRarities);

                        if(rarity === 'Rare Secret' && !canHaveSecretRare) {
                            continue;
                        }

                        filteredCards = packCardsPool.filter(x => x.rarity === rarity.name);
                    }
                    
                    card = filteredCards[Math.floor(Math.random() * filteredCards.length)];
                }

                const attacks = [];

                if(card.attacks) {
                    for(let k = 0; k < card.attacks.length; k++) {
                        const attack = card.attacks[k];

                        if(!attack.damage) {
                            continue;
                        }

                        let attackType;
                        const attackTypes = new Set(attack.cost);

                        if(attackTypes.size === 1) {
                            attackType = [...attackTypes][0];
                        }
                        else if(attackTypes.size === 2) {
                            attackTypes.delete('Colorless');
                            attackType = [...attackTypes][0];
                        }
                        else {
                            attackType = 'Colorless';
                        }
    
                        attacks.push({
                            name: attack.name,
                            type: attackType,
                            cost: attack.convertedEnergyCost,
                            damage: attack.damage
                        });
                    }
                }

                cards.push({
                    id: card.id,
                    name: card.name,
                    number: card.number,
                    rarity: card.rarity,
                    weaknesses: card.weaknesses,
                    resistances: card.resistances,
                    attacks: attacks,
                    images: {
                        small: card.images.small,
                        large: card.images.large
                    }
                });

                packCardsPool = packCardsPool.filter(x => x.id !== card.id);

                j++;
            }

            const packId = set.id + '-' + Date.now() + '' + Math.floor(Math.random() * 10);
            const packHash = await argon2.hash(packId, {
                type: argon2.argon2id,
                timeCost: 2,
                hashLength: 16,
                raw: true
            });

            const pack = {
                id: hashUtils.hashToHex(packHash) + (Math.floor(Math.random() * 16).toString(16)),
                set_id: setResult.insertedId,
                total_cards: 10,
                rarity_found: cards[9].rarity,
                images: {
                    symbol: setApiResult.images.symbol,
                    logo: setApiResult.images.logo
                },
                withdrawed: false
            };
    
            const packResult = await db.collection('packs').insertOne(pack);
    
            if(packResult.acknowledged) {
                for(let i = 0; i < cards.length; i++) {
                    const cardId = pack.id + (i + 1).toString(16);
                    
                    cards[i].id = cardId;
                    cards[i].pack_id = pack.id;
    
                    await db.collection('cards').insertOne(cards[i]);
                }
            }
        }
    }

    return set;
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

function getRandomRarity(availableRarities) {
    let sum = 0;

    const rarities = constants.rarities.filter(x => availableRarities.includes(x.name));

    rarities.forEach(rarity => {
        sum += rarity.probability;
    });

    let pick = Math.random() * sum;
    
    const orderedRarities = rarities
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