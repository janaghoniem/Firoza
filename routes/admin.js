const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// Route to add a User
router.post('/addAdmin', adminController.addAdmin);

//Route to add collection
router.post('/addCollection', adminController.addCollection);
//Route to delete collection
//Route to edit collection







module.exports = router;
