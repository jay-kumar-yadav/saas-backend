const express = require('express');
const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
//router.post('/signup', signup); // Optional: if you want to allow user registration
router.get('/me', protect, getMe);

module.exports = router;