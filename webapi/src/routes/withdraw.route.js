const express = require('express');
const expressQueue = require('express-queue');
const router = express.Router();
const controller = require('../controllers/withdraw.controller');

router.get('/', controller.get, expressQueue({ activeLimit: 1 }));

module.exports = router;