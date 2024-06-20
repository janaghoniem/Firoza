const express = require('express');
const session = require('express-session');
const router = express.Router();
const adminController = require('../controllers/admin');
const Product = require('../models/product'); 
const multer = require('multer');
const path = require('path');

const getCollections  = require('../models/Collections'); 
const Order = require('../models/Orders');
const User = require('../models/User');
const Request = require('../models/Requests');



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
router.get('/addAdmin', adminController.getadmin);


//Route to add collection
router.post('/addCollection', adminController.addCollection);
//Route to delete collection
//Route to edit collection

router.get('/users', adminController.GetAllUsers);
//route to add a product
router.post('/addProduct', adminController.addProduct);

router.get('/addProduct', async (req, res) => {
    try {
        const collections = await getCollections.find(); // Fetch all collections
        console.log('Collections fetched:', collections); // Debugging output
        res.render('addProduct', { collections }); // Pass collections to the template
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});




router.get('/EditProduct/:id',  adminController.getEditProductPage);


router.get('/EditLayout', adminController.getCollections );
router.delete('/deleteCollection/:id', adminController.deleteCollection);
router.post('/editCollection/:id', adminController.editCollection);

router.get('/indian', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('indian', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


router.get('/shopAll', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('shopAll', { products });
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
router.get('/orders', adminController.getOrders);


// router.get('/editProduct/:id', async (req, res) => {
//     try {
//         const productId = req.params.id;
//         const product = await Product.findById(productId); // Fetch the product from the database
//         if (!product) {
//             return res.status(404).send('Product not found');
//         }
//         res.render('editProduct', { product }); // Render the edit product page with the product data
//     } catch (error) {
//         console.error('Error fetching product:', error);
//         res.status(500).send('Server error');
//     }
// });
//router.get('/editProduct/:id', adminController.getEditProductPage);




router.post('/EditProduct/:id', adminController.editProduct);


router.get('/AddCollection', (req, res) => {
    res.render("AddCollection.ejs");
});


router.get('/EditCollection', (req, res) => {
    res.render("EditCollection.ejs");
});

// router.post('/customize', adminController.customize);

router.get('/AddProduct', (req, res) => {
    res.render("addProduct.ejs");
});

router.get('/Dashboard',adminController.getDashboard);
router.get('/statistics',adminController.getStatistics);
router.get('/product', (req, res) => {
    res.render("Admin-products.ejs");
});

router.get('/EditLayout', (req, res) => {
    res.render("EditLayout.ejs");
});

// app.delete('/EditLayout/:id', adminController.deleteCollection);

router.get('/EditLayout', async (req, res) => {
    try {
        const collections = await collectiona.find({});
        res.status(500).json(collections);
    } catch (err) {
        res.status(500).json({messege: err.messege});
    }
});
router.get('/requests', adminController.getAllRequests);
// Route to accept a request
router.post('/acceptRequest/:id', adminController.acceptRequest);
// Route to reject a request
router.post('/rejectRequest/:id', adminController.rejectRequest);

router.post('/checkAddress', adminController.admincheckaddress);
module.exports = router;
