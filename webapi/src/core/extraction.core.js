const fs = require('fs');
const path = require('path');
const tcgSdk = require('pokemontcgsdk');
const constants = require('../constants/extraction.constant');

tcgSdk.configure({ apiKey: process.env.TCG_API_KEY });

const MAX_MARGIN = 1;

async function fetchExchangeRate() {
    const exchangeRateRequest = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=EUR');
    
    if(exchangeRateRequest.ok) {
        return (await exchangeRateRequest.json()).rates.EUR;
    }
    else {
        console.error('Impossible to retrieve exchange rate from USD to EUR, shutting down');
        return null;
    }
}

async function getSets() {
    const sets = await tcgSdk.set.all();

    return sets.map(x => ({
        id: x.id,
        series: x.series,
        printed_cards: x.printedTotal,
        total_cards: x.total,
        release_date: x.releaseDate,
        images: x.images
    })).sort((a, b) => a.id - b.id);
}

async function getSetCards(setId, linkedSetId) {
    let cards = await tcgSdk.card.all({ q: 'set.id:' + setId });

    if(linkedSetId) {
        cards = cards.concat(await tcgSdk.card.all({ q: 'set.id:' + linkedSetId }));
    }

    return cards;
}

function getLinkedSet(setId) {
    const linkedSet = constants.linkedSetIds.filter(x => x.source === setId);

    if(linkedSet.length === 1) {
        return linkedSet[0].destination;
    }

    return null;
}

function cleanUnusedCards(cards) {
    const toRemove = [];

    for(let i = 0; i < cards.length; i++) {
        if(cards[i].supertype === 'Energy') {
            toRemove.push(i);
        }
    }

    return cards.filter((x, i) => !toRemove.includes(i));
}

function filterCardsByRarity(cards, rarity) {
    if(rarity === constants.cardRarities[2]) {
        return cards.filter(x => x.rarity !== constants.cardRarities[0] &&
            x.rarity !== constants.cardRarities[1]);
    }
    else {
        return cards.filter(x => x.rarity === rarity);
    }
}

function calcAvgSetCardsPrice(cards) {
    const sumOfPrices = cards
        .filter(x => x.price)
        .map(x => x.price)
        .reduce((accumulator, current) => accumulator + current, 0);

    const countWithPrice = cards.filter(x => x.price).length;

    return parseFloat((sumOfPrices / countWithPrice).toFixed(2));
}

function applyExchangeRateToCards(cards, rate) {
    for(let i = 0; i < cards.length; i++) {
        const card = cards[i];

        if(card.cardmarket) {
            card.price = card.cardmarket.prices.avg30;
        }
        else if(card.tcgplayer) {
            if(card.tcgplayer.prices.holofoil) {
                card.price = card.tcgplayer.prices.holofoil.market * rate;
            }
            else if(card.tcgplayer.prices.reverseHolofoil) {
                card.price = card.tcgplayer.prices.reverseHolofoil.market * rate;
            }
            else if(card.tcgplayer.prices.normal) {
                card.price = card.tcgplayer.prices.normal.market * rate;
            }
        }
    }

    const avgPrice = calcAvgSetCardsPrice(cards);

    for(let i = 0; i < cards.length; i++) {
        const card = cards[i];

        if(!card.price) {
            card.price = avgPrice;
        }
    }
}

function calcMaxWeight(array, property) {
    const max = Math.max(...array.map(x => x[property]));
    return max + (max / 10);
}

function calcCardPoints(card, printedCards) {
    if(parseInt(card.number) > printedCards) {
        return 5;
    }
    if(card.rarity === 'Rare Holo V') {
        return 1;
    }
    else if(!constants.cardRarities.includes(card.rarity)) {
        return 3;
    }

    return 0;
}

async function analyzeSetCards(cards, rate, printedCards) {
    const analyzed = [];

    cards = cleanUnusedCards(cards);

    for(let i = 0; i < constants.cardRarities.length; i++) {
        const rarity = constants.cardRarities[i];

        const filteredCards = filterCardsByRarity(cards, rarity);
        applyExchangeRateToCards(filteredCards, rate);

        let weightsSum = 0;
        let maxWeight = calcMaxWeight(filteredCards, 'price');

        for(let j = 0; j < filteredCards.length; j++) {
            const w = (maxWeight + MAX_MARGIN) - filteredCards[j].price;
            weightsSum += w;
        }

        for(let j = 0; j < filteredCards.length; j++) {
            const card = filteredCards[j];

            const w = (maxWeight + MAX_MARGIN) - card.price;
            const p = w / weightsSum;

            // DEBUG_ONLY
            if(isNaN(p)) {
                console.log('NaN!');
            }

            analyzed.push({
                images: card.images,
                name: card.name,
                number: card.number,
                prob: p,
                rarity: card.rarity,
                resistances: card.resistances,
                types: card.types,
                value: card.price,
                weaknesses: card.weaknesses,
                points: calcCardPoints(card, printedCards)
            });
        }
    }

    return analyzed.sort((a, b) => a.number - b.number);
}

async function fillSets(sets, rate) {
    const analyzed = [];
    const toRemove = [];

    for(let i = 0; i < sets.length; i++) {
        const set = sets[i];

        if(analyzed.includes(set.id) ||
            constants.toSkipIds.includes(set.id) ||
            constants.trainerKitIds.includes(set.id)) {

            toRemove.push(set.id);
            continue;
        }

        analyzed.push(set.id);

        const linkedSetId = getLinkedSet(set.id);

        if(linkedSetId) {
            analyzed.push(linkedSetId);
            toRemove.push(linkedSetId);
        }

        const cards = await getSetCards(set.id, linkedSetId);

        if(constants.promoSetIds.includes(set.id)) {
            set.type = constants.setTypes.PROMO;
        }
        else if(constants.specialSetIds.includes(set.id)) {
            set.type = constants.setTypes.SPECIAL;
        }
        else {
            set.type = constants.setTypes.MAIN;
        }

        const analyzedCards = await analyzeSetCards(cards, rate, set.printed_cards);
        set.cards = analyzedCards;
        
        set.total_value = set.cards
            .map(x => x.value)
            .reduce((accumulator, current) => accumulator + current, 0);

        console.log(`(${i+1}/${sets.length}) ... ${((i+1) / sets.length * 100).toFixed(2)}%`);
    }

    sets = sets.filter(x => !toRemove.includes(x.id));
}

function analyzeGroupOfSets(sets) {
    let weightsSum = 0;
    let maxWeight = calcMaxWeight(sets, 'total_value');

    for(let i = 0; i < sets.length; i++) {
        const w = (maxWeight + MAX_MARGIN) - sets[i].total_value;
        weightsSum += w;
    }

    for(let i = 0; i < sets.length; i++) {
        const set = sets[i];

        const w = (maxWeight + MAX_MARGIN) - set.total_value;
        const p = w / weightsSum;

        set.prob = p;
        delete set.total_value;
    }
}

function saveFile(path, name, content) {
    const fileName = path + name;

    try {
        if(!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }

        fs.writeFileSync(fileName, content);
        console.log(`File ${fileName} saved`);
    }
    catch(err) {
        console.error(`File ${fileName} not saved: ${err}`);
    }
}

module.exports = async function() {
    const exchangeRate = await fetchExchangeRate();

    if(!exchangeRate) {
        return;
    }

    const sets = await getSets();
    await fillSets(sets, exchangeRate);

    const saveFilesPath = path.resolve(__dirname, '../../data/'); 

    const promoSpecialSets = sets.filter(x => x.type === constants.setTypes.PROMO ||
        x.type === constants.setTypes.SPECIAL);
    analyzeGroupOfSets(promoSpecialSets);
    saveFile(saveFilesPath, '/promo_special_sets.json', JSON.stringify(promoSpecialSets));

    const mainSets = sets.filter(x => x.type === constants.setTypes.MAIN);
    analyzeGroupOfSets(mainSets);
    saveFile(saveFilesPath, '/main_sets.json', JSON.stringify(mainSets));
};