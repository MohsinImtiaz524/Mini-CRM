const express = require('express');
const router = express.Router();
const { register, login, getUsers } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/users
router.get('/users', auth, getUsers);

module.exports = router;
