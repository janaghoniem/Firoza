const express = require('express');
const session = require('express-session');
const router = express.Router();
const adminController = require('../controllers/admin');

// check if admin
router.use((req, res, next) => {
    if (req.session.user !== undefined && req.session.user.Type === 'admin') {
        next();
    }
    else {
       console.log('You are not an Admin')
    }
});

// Route to add a User
router.post('/addAdmin', adminController.addAdmin);

//Route to add collection
router.post('/addCollection', adminController.addCollection);
//Route to delete collection
//Route to edit collection



router.post('/addProduct', adminController.addProduct);



module.exports = router;
