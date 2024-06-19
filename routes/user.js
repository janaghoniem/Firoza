const express = require('express');
const router = express.Router();
const User = require('../controllers/User'); 
const userr = require('../models/User');

const restrictedPaths = [
    // '/admin',
    '/Checkout'
];

// Unauthorized users 
router.use((req, res, next) => {
    if (req.session.user === undefined && restrictedPaths.includes(req.path)) {
        console.log(req.session.user);
        console.log('You are not authorized to access this path');
        res.status(403).send('You are not authorized to access this path');
    } else {
        next();
    }
});

// Handle POST request for login
router.post('/login', User.GetUser);

// Handle POST request for signup
router.post('/signup', User.AddUser);

// Handle POST request for checkAddress
router.post('/checkAddress', User.checkAddress);

// Handle POST request for checkLoggedIn
router.post('/checkLoggedIn', User.checkLoggedIn);

// Handle POST request for search
router.post('/search', User.Search);

// Handle POST request for add to cart
router.post('/add-to-cart', User.AddToCart)

// Handle POST request for cart
router.get('/ShoppingCart', User.Cart);

// Handle cart update
router.put('/updateCart', User.updateCart);

// Handle cart total price update
router.put('/updateCartPrice', User.updateCartPrice);

// Route to remove an item from the cart
router.delete('/remove-from-cart/:productId', User.removeFromCart);

// Route to checkout
router.post('/checkout', User.Checkout);

// Get wishlist
router.get('/wishlist', User.getWishlist);

// Add to wishlist
router.post('/wishlist/add', User.AddToWishlist);

// Remove from wishlist
router.delete('/wishlist/remove/:productId', User.removeFromWishlist);


// router.post('/products/filter', async (req, res) => {
//     const { categories, colors, priceRange, materials } = req.body;

//     const filters = {};

//     if (categories && categories.length) filters.category = { $in: categories };
//     if (colors && colors.length) filters.color = { $in: colors };
//     if (materials && materials.length) filters.material = { $in: materials };
//     if (priceRange) filters.price = { $lte: priceRange };

//     console.log("Filters applied:", filters); // Debugging information

//     try {
//         const products = await Product.find(filters);
//         res.json(products);
//         console.log("Filtered products:", products); // Debugging information
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         res.status(500).json({ message: 'Error fetching products', error });
//     }
// });

router.post('/filter', User.filterProducts); 

router.get('/shopAll',User.getShopAllProducts);

router.get('/indian',User.getIndianProducts);

router.post('/Billing-Information', User.BillingInformation);

router.get('/Checkout', async (req, res) => {
    try {
        const user = await userr.findById(req.session.user._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Render the EJS template and pass user data
        res.render('Checkout', { user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/users/:id', User.getUserById);

router.get('/myAccount', User.getUserOrder );


const getCollectionProducts = async (req, res) => {
    const collectionId = req.params.collectionId;
    try {
        const collection = await Collection.findOne({ collection_id: collectionId }).populate('item_products');
        if (!collection) {
            return res.status(404).send('Collection not found');
        }
        res.render('collection', {
            collectionName: collection.Collection_Name,
            collectionDescription: collection.Collection_Description,
            collectionImage: collection.img,
            collectionFolder: collection.img, // Assuming folder is same as image field in this case
            products: collection.item_products
        });
    } catch (error) {
        console.error('Error fetching collection products:', error);
        res.status(500).send('Server Error');
    }
};

router.get('/collection/:collectionId', getCollectionProducts);
router.post('/cancelOrder/:orderId', async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Update the order status to 'cancelled'
        order.status = 'cancelled';
        await order.save();

        res.json({ success: true, message: 'Order cancelled successfully' });
    } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
module.exports = router;
