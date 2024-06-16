const express = require('express');
const session = require('express-session');
const router = express.Router();
const adminController = require('../controllers/admin');
const Product = require('../models/product'); 
const getCollections  = require('../models/Collections'); 

// check if admin
// router.use((req, res, next) => {
//     if (req.session.user !== undefined && req.session.user.isAdmin) {
//         next();
//     }
//     else {
//         console.log(req.session.user);
//         console.log('You are not an Admin')
//     }
// });

// Route to add a User
router.post('/addAdmin', adminController.addAdmin);

//Route to add collection
router.post('/addCollection', adminController.addCollection);
//Route to delete collection
//Route to edit collection

router.get('/users', adminController.GetAllUsers);
//route to add a product
router.post('/addProduct', adminController.addProduct);

router.get('/EditLayout', adminController.getCollections );


router.get('/indian', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('indian', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


module.exports = router;
