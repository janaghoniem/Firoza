const express = require('express');
const router = express.Router();
const User = require('../controllers/User'); 

// Handle POST request for login
router.post('/login', User.GetUser);

// Handle POST request for signup
router.post('/signup', User.AddUser);

// Handle POST request for checkAddress
router.post('/checkAddress', User.checkAddress);

// Handle POST request for search
router.post('/search', User.Search);

module.exports = router;
