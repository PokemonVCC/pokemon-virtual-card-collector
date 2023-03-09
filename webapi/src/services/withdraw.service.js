const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const tcgSdk = require('pokemontcgsdk');
const tcgConfig = require('../configs/tcg.config');
const constants = require('../constants/withdraw.constant');
const mongo = require('./db.service');

const db = mongo.get();

tcgSdk.configure({ apiKey: tcgConfig.key });

function loadSetsData() {
    const setsDataPath = path.resolve(__dirname, '../../data', './main_sets.json');
    return JSON.parse(fs.readFileSync(setsDataPath, 'utf8'));
}

function getLowerBound(sums, target, low, high) {
    if (low === high) {
        return low;
    }

    const midPoint = Math.floor((low + high) / 2);

    if (target < sums[midPoint]) {
        return getLowerBound(sums, target, low, midPoint);
    }
    else if (target > sums[midPoint]) {
        return getLowerBound(sums, target, midPoint + 1, high);
    }
    else {
        return midPoint + 1;
    }
}

function extractByLowerBound(array, idKey, probKey) {
    const sums = [0];
    const keys = [];

    array = array.sort((a, b) => b[probKey] - a[probKey]);

    for (let i = 0; i < array.length; i++) {
        keys.push(array[i][idKey]);
        sums.push(sums[sums.length - 1] + array[i][probKey]);
    }


    const target = Math.random() * sums[sums.length - 1];
    const bound = getLowerBound(sums, target, 0, sums.length - 1);

    if (!keys[bound]) {
        return keys[bound - 1];
    }
    else {
        return keys[bound];
    }
}

function pickRandomSet(setsData) {
    const setId = extractByLowerBound(setsData, 'id', 'prob');
    return setsData.find(x => x.id === setId);
}

function filterCardsByRarity(set, rarity, includeSecretRare) {
    if(rarity === 'Reverse Holo') {
        return set.cards.filter(x => x.rarity === 'Common' || x.rarity === 'Uncommon' || x.rarity === 'Rare' || x.rarity === 'Rare Holo');
    }
    else if (rarity === 'Common' || rarity === 'Uncommon') {
        return set.cards.filter(x => x.rarity === rarity);
    }
    else if (rarity === 'Rare') {
        if (includeSecretRare) {
            return set.cards.filter(x => x.rarity !== 'Common' && x.rarity !== 'Uncommon');
        }
        else {
            return set.cards.filter(x => x.rarity !== 'Common' && x.rarity !== 'Uncommon' && parseInt(x.number) <= set.printed_cards);
        }
    }
}

function pickRandomCardsByRarity(set, rarity, number, includeSecretRare) {
    const filteredCards = filterCardsByRarity(set, rarity, includeSecretRare);
    const cards = [];

    for (let i = 0; i < number; i++) {
        let cardNumber;

        do {
            cardNumber = extractByLowerBound(filteredCards, 'number', 'prob');
        } while (cards.filter(x => parseInt(x.number) === parseInt(cardNumber)).length > 0);

        const card = structuredClone(filteredCards.find(x => parseInt(x.number) === parseInt(cardNumber)));

        card.is_reverse = rarity === 'Reverse Holo';

        cards.push(card);
    }

    return cards;
}

async function loadNewSet() {
    const set = pickRandomSet(loadSetsData());

    const hasSecretRare = Math.random() <= (1 / 72);

    const newSet = {
        id: crypto.randomBytes(64).toString('hex'),
        creation_time: new Date(),
        tcg_id: set.id,
        series: set.series,
        printed_cards: set.printed_cards,
        total_cards: set.total_cards,
        images: set.images,
        type: set.type,
        packs_available: 36,
        has_secret_rare: hasSecretRare,
        release_date: set.release_date
    };

    const setResult = await db.collection('sets').insertOne(newSet);

    if (!setResult.acknowledged) {
        throw new Error('Error during new set generation');
    }

    let createdPacks = 36;
    const cardsDistribution = constants.cardDistributionBySetTcgId(set.id);

    for (let i = 0; i < 36; i++) {
        const cards = [];

        for(let j = 0; j < cardsDistribution.length; j++) {
            const distribution = cardsDistribution[j];

            cards.push(...pickRandomCardsByRarity(set, distribution.rarity, distribution.count, hasSecretRare));
        }

        const pack = {
            id: crypto.randomBytes(64).toString('hex'),
            set_id: newSet.id,
            set_tcg_id: newSet.tcg_id,
            creation_time: new Date(),
            number: i + 1,
            total_cards: 10,
            rarity_found: cards[9].rarity,
            images: set.images,
            withdrawn: false
        };

        const packResult = await db.collection('packs').insertOne(pack);

        if (!packResult.acknowledged) {
            console.error('Error during new pack generation');
            createdPacks--;
        }

        for (let j = 0; j < cards.length; j++) {
            const card = cards[j];

            await db.collection('cards').insertOne({
                id: crypto.randomBytes(64).toString('hex'),
                pack_id: pack.id,
                set_id: newSet.id,
                creation_time: new Date(),
                images: card.images,
                name: card.name,
                number: parseInt(card.number),
                rarity: card.rarity,
                is_reverse: card.is_reverse,
                types: card.types,
                value: card.value,
                weaknesses: card.weaknesses,
                points: card.points
            });
        }
    }

    await db.collection('sets').updateOne({ _id: setResult.insertedId }, { $set: { packs_available: createdPacks } });

    return newSet;
}

async function withdrawPack(userId) {
    try {
        let set = await db.collection('sets').findOne({
            packs_available: {
                $gt: 0
            }
        });

        if (!set) {
            set = await loadNewSet();
        }

        const packs = await db.collection('packs')
            .find({ set_id: set.id, withdrawn: false })
            .toArray();
        const pack = packs[Math.floor(Math.random() * packs.length)];

        const cards = await db.collection('cards').find({ set_id: set.id, pack_id: pack.id }).toArray();

        for (let i = 0; i < cards.length; i++) {
            await db.collection('cards').updateOne({ _id: cards[i]._id }, { $set: { user_id: userId } });

            delete cards[i]._id;
        }

        await db.collection('packs').updateOne({ _id: pack._id }, { $set: { user_id: userId, withdrawn: true } });
        await db.collection('sets').updateOne({ _id: set._id }, { $set: { packs_available: set.packs_available - 1 } });

        delete pack._id;
        delete pack.withdrawn;

        pack.cards = cards;

        return pack;
    }
    catch (e) {
        throw e;
    }
}

module.exports = {
    withdrawPack
};