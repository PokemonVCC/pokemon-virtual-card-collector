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

async function getByQuery(req, res, next) {
    try{

    }
    catch (err) {
        console.error('Error on /card [GET]');
        next(err);
    }
}

module.exports = {
    getById,
    getByQuery
};