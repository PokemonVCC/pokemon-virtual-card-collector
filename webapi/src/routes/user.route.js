const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

router.get('/:id', controller.get);
router.post('/', controller.post);
router.put('/:id', controller.put);

module.exports = router;