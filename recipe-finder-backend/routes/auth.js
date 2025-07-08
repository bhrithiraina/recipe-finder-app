const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware'); // middleware to verify token
const { register, login, getFavorites } = require('../controllers/authcontroller');

router.post('/register', register);
router.post('/login', login);
router.get('/favorites', authenticate, getFavorites);

module.exports = router;