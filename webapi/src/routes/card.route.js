const express = require('express');
const router = express.Router();
const controller = require('../controllers/card.controller');

router.get('/', controller.getByQuery)
router.get('/:id', controller.getById);

module.exports = router;