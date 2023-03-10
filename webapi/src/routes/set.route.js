const express = require('express');
const router = express.Router();
const controller = require('../controllers/set.controller');

router.get('/list/:user_id', controller.getByUserId);
router.get('/:id', controller.getById);

module.exports = router;