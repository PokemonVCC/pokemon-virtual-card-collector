const express = require('express');
const router = express.Router();
const controller = require('../controllers/card.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/:user_id/:set_tcg_id', controller.getByUserIdAndSetTcgId);
router.get('/:id', controller.getById);

module.exports = router;