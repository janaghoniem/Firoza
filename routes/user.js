const express = require('express');
const router = express.Router();
const User = require('../controllers/User'); // Import your user controller

// Handle POST request for login
router.post('/login', User.GetUser);


// Handle POST request for signup
router.post('/signup', User.AddUser);

module.exports = router;
