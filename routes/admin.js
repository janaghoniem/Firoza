const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// Route to add a User
router.post('/addUser', adminController.addAdmin);

module.exports = router;
