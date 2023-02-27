const express = require('express');
const expressQueue = require('express-queue');
const router = express.Router();
const controller = require('../controllers/withdraw.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, controller.get, expressQueue({ activeLimit: 1 }));

module.exports = router;