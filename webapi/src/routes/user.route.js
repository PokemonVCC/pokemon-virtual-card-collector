const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/:id', controller.get);
router.post('/', controller.post);
router.put('/', authMiddleware, controller.put);

module.exports = router;