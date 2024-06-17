const express = require('express');
const session = require('express-session');
const router = express.Router();
const adminController = require('../controllers/admin');
const Product = require('../models/product'); 
const multer = require('multer');
const path = require('path');

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
router.delete('/deleteCollection/:id', adminController.deleteCollection);

router.get('/indian', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('indian', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
router.get('/getProduct/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// router.get('/editProduct/:id', adminController.getEditProductPage);
// router.post('/editProduct/:id', adminController.editProduct);

router.get('/product', adminController.getProducts);
router.delete('/deleteProduct/:id', adminController.deleteProduct);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${uuidv4()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Use upload.single('collectionImage') in the route handling the form submission
router.post('/addCollection', upload.single('collectionImage'), adminController.addCollection);

//route ll orders "admin pov"
router.get('/orders', async (req, res, next) => {
    try {
        await adminController.getOrders(req, res);
    } catch (err) {
        next(err);
    }
});
router.get('/editProduct/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId); // Fetch the product from the database
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('editProduct', { product }); // Render the edit product page with the product data
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Server error');
    }
});
router.get('/editProduct/:id', adminController.getEditProductPage);


module.exports = router;
