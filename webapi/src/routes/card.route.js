const express = require('express');
const router = express.Router();
const controller = require('../controllers/card.controller');

router.get('/list/:user_id/:set_tcg_id', controller.getByUserIdAndSetTcgId);
router.get('/count/:user_id/:set_tcg_id', controller.countByUserIdAndSetTcgId);
router.get('/value/:user_id/:set_tcg_id', controller.valueByUserIdAndSetTcgId);
router.get('/points/:user_id/:set_tcg_id', controller.pointsByUserIdAndSetTcgId);
router.get('/:id', controller.getById);

module.exports = router;