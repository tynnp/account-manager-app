const express = require('express');
const router = express.Router();
const { login, changePin } = require('../controllers/authController');

router.post('/login', login);
router.post('/change-pin', changePin);

module.exports = router;
