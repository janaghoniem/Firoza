const express = require('express');
const session = require('express-session');
const router = express.Router();
const adminController = require('../controllers/admin');
const Product = require('../models/product'); 
const getCollections  = require('../models/Collections'); 
const Order = require('../models/Orders');


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
router.delete('/EditLayout/:id', adminController.deleteCollection);

router.get('/indian', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('indian', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
router.get('/product', adminController.getProducts);
router.delete('/deleteProduct/:id', adminController.deleteProduct);

//route ll orders "admin pov"
router.get('/orders', async (req, res, next) => {
    try {
        await adminController.getOrders(req, res);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
