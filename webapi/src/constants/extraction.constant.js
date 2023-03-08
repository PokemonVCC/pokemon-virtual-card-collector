const promoSetIds = [
    'basep',
    'np',
    'dpp',
    'pop1',
    'pop2',
    'pop3',
    'pop4',
    'pop5',
    'pop6',
    'pop7',
    'pop8',
    'pop9',
    'hsp',
    'bwp',
    'xyp',
    'smp',
    'si1',
    'bp',
    'swshp'
];

const trainerKitIds = [
    'tk1a',
    'tk1b',
    'tk2a',
    'tk2b',
    'xy0'
];

const specialSetIds= [
    'dv1',
    'dc1',
    'g1',
    'sm35',
    'sm75',
    'det1',
    'sm115',
    'swsh35',
    'swsh45',
    'cel25',
    'pgo',
    'swsh12pt5'
];

const toSkipIds = [
    'mcd11',
    'mcd12',
    'mcd14',
    'mcd15',
    'mcd16',
    'mcd17',
    'mcd18',
    'mcd19',
    'mcd21',
    'mcd22',
    'fut20',
    'ru1'
];

const linkedSetIds = [
    {
        source: 'sm115',
        destination: 'sma'
    },
    {
        source: 'swsh45',
        destination: 'swsh45sv'
    },
    {
        source: 'cel25',
        destination: 'cel25c'
    },
    {
        source: 'swsh12pt5',
        destination: 'swsh12pt5gg'
    },
    {
        source: 'swsh9',
        destination: 'swsh9tg'
    },
    {
        source: 'swsh10',
        destination: 'swsh10tg'
    },
    {
        source: 'swsh11',
        destination: 'swsh11tg'
    },
    {
        source: 'swsh12',
        destination: 'swsh12tg'
    }
];

const setTypes = {
    MAIN: 'MAIN',
    PROMO: 'PROMO',
    SPECIAL: 'SPECIAL'
};

const cardRarities = [
    'Common',
    'Uncommon',
    'Rare'
];

module.exports = {
    cardRarities,
    linkedSetIds,
    promoSetIds,
    setTypes,
    specialSetIds,
    toSkipIds,
    trainerKitIds
};