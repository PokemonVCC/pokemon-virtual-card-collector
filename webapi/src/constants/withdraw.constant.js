const cardDistributionBySetTcgId = (setTcgId) => {
    switch(setTcgId) {
        case 'base1':
        case 'base2':
        case 'base3':
        case 'base4':
        case 'base5':
        case 'gym1':
        case 'gym2':
        case 'neo1':
        case 'neo2':
        case 'neo3':
        case 'neo4':
        case 'ecard1':
            return [
                {
                    rarity: 'Common',
                    count: 7
                },
                {
                    rarity: 'Uncommon',
                    count: 3
                },
                {
                    rarity: 'Rare',
                    count: 1
                }
            ];
        case 'ecard2':
        case 'ecard3':
        case 'ex1':
        case 'ex2':
        case 'ex3':
        case 'ex4':
        case 'ex5':
        case 'ex6':
        case 'ex7':
        case 'ex8':
        case 'ex9':
        case 'ex10':
        case 'ex11':
        case 'ex12':
        case 'ex13':
        case 'ex14':
        case 'ex15':
        case 'ex16':
            return [
                {
                    rarity: 'Common',
                    count: 5
                },
                {
                    rarity: 'Uncommon',
                    count: 2
                },
                {
                    rarity: 'Reverse Holo',
                    count: 1  
                },
                {
                    rarity: 'Rare',
                    count: 1
                }
            ];
        default: 
            return [
                {
                    rarity: 'Common',
                    count: 5
                },
                {
                    rarity: 'Uncommon',
                    count: 3
                },
                {
                    rarity: 'Reverse Holo',
                    count: 1  
                },
                {
                    rarity: 'Rare',
                    count: 1
                }
            ];
    }
};

const dropPointsCost = 6 * 24;

module.exports = {
    cardDistributionBySetTcgId,
    dropPointsCost
};