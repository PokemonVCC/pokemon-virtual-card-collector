const service = require('../services/set.service');

async function getById(req, res, next) {
    try{
        if(!req.params.id) {
            res.status(400);
            res.json({ message: 'Missing set id' });
            return;
        }

        const set = await service.getSet(req.params.id);
        
        if(!set) {
            res.status(404);
            res.json({ message: 'Set not found '});
        }
        else {
            res.json(set);     
        }
    }
    catch (err) {
        console.error('Error on /set/:id [GET]');
        next(err);
    }
}

async function getByUserId(req, res, next) {
    try {
        if(!req.params.user_id) {
            res.status(400);
            res.json({ message: 'Missing required parameters' });
            return;
        }

        const sets = await service.getSetsByUserId(req.params.user_id);

        if(sets.length === 0) {
            res.status(404);
            res.json({ message: 'No sets found' });
            return;
        }

        for(let i = 0; i < sets.length; i++) {
            delete sets[i]._id;
            delete sets[i].id;
            delete sets[i].creation_time;
            delete sets[i].has_secret_rare;
            delete sets[i].packs_available;
            delete sets[i].total_cards;
        }

        res.json({ data: sets });
    }
    catch (err) {
        console.error('Error on /set/list/:user_id [GET]');
        next(err);
    }
}

module.exports = {
    getById,
    getByUserId
};