const service = require('../services/withdraw.service');
const withdrawConstants = require('../constants/withdraw.constant');
const userService = require('../services/user.service');

async function get(req, res, next) {
    try{
        const dropPoints = await userService.updateDropPoints(req.authenticatedUser.id);

        if(dropPoints === -1) {
            res.status(404);
            res.json({ message: 'User not found' });
            return;
        }
        else if(!dropPoints ||
            (dropPoints && dropPoints < withdrawConstants.dropPointsCost)) {
            res.status(400);
            res.json({ message: 'Not enough drop points' });
            return;
        }

        const pack = await service.withdrawPack(req.authenticatedUser.id);
        
        if(!pack) {
            res.status(404);
            res.json({ message: 'Pack not found' });
            return;
        }

        await userService.updateDropPoints(req.authenticatedUser.id, withdrawConstants.dropPointsCost);

        res.json({ data: pack });
    }
    catch (err) {
        console.error('Error on /withdraw [GET]');
        next(err);
    }
}

module.exports = {
    get
};