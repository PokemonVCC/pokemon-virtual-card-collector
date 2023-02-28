const express = require('express');
const router = express.Router();
const controller = require('../controllers/card.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/me', authMiddleware, controller.getByUser);
router.get('/:id', controller.getById);

module.exports = router;