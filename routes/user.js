const express = require('express');
const router = express.Router();
const User = require('../controllers/User'); 
const UserSchema = require('../models/User');
const Collection =  require('../models/Collections');
const Product = require('../models/product');

const restrictedPaths = [
    '/myAccount',
    '/Checkout'
];

// Middleware to check authorization
router.use((req, res, next) => {
    if (req.session.user === undefined && restrictedPaths.includes(req.path)) {
        console.log('You are not authorized to access this path');
        res.status(403).send('You are not authorized to access this path');
    } else {
        next();
    }
});

// Route to get collection by name
router.get('/user/:collectionName', async (req, res) => {
    try {
        const formattedCollectionName = req.params.collectionName;
        const collectionName = formattedCollectionName.replace(/-/g, ' ');

        const collection = await Collection.findOne({ Collection_Name: collectionName });
        console.log(collectionName);
        if (!collection) {
            return res.status(404).send('Collection not found');
        }

        const products = await Product.find({ collection_id: collection._id });

        res.render('indian', {
            img: collection.img,
            Collection_Name: collection.Collection_Name,
            Collection_Description: collection.Collection_Description,
            products: products
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Other routes
router.post('/login', User.GetUser);
router.post('/signup', User.AddUser);
router.post('/checkAddress', User.checkAddress);
router.post('/checkLoggedIn', User.checkLoggedIn);
router.post('/search', User.Search);


// CART
router.post('/add-to-cart', User.AddToCart)
router.get('/ShoppingCart', User.Cart);
router.post('/ShoppingCart', User.Cart);
router.put('/updateCart', User.updateCart);
router.put('/updateCartPrice', User.updateCartPrice);
router.delete('/remove-from-cart/:productId', User.removeFromCart);

// CHECKOUT
router.post('/Billing-Information', User.BillingInformation);
router.post('/checkout', User.Checkout);


// WISHLIST
router.get('/wishlist', User.getWishlist);
router.post('/wishlist/add', User.AddToWishlist);
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


// router.get('/Checkout', async (req, res) => {
//     try {
//         const user = await UserSchema.findById(req.session.user._id);

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         res.render('Checkout', { user });
//     } catch (error) {
//         console.error('Error fetching user:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

router.get('/users/:id', User.getUserById);

router.get('/myAccount', User.getUserOrder);
router.post('/myAccount/Edit-Personal-information', User.updateUser);
router.post('/check-email-update', User.checkUpdateEmailAvailibility);

router.delete('/cancel-order/:orderId', User.cancelOrder);

//router.get('/products/:productId/reviews', User.getReviewsByProductId);

router.get('/product/:productId', User.getProductDetails);

const getCollectionProducts = async (req, res) => {
    const collectionId = req.params.collectionId;
    try {
        const collection = await Collection.findOne({ _id: collectionId }).populate('item_products');
        if (!collection) {
            return res.status(404).send('Collection not found');
        }
        res.render('collection', {
            collectionName: collection.Collection_Name,
            collectionDescription: collection.Collection_Description,
            collectionImage: collection.img,
            products: collection.item_products
        });
    } catch (error) {
        console.error('Error fetching collection products:', error);
        res.status(500).send('Server Error');
    }
};

router.get('/collection/:collectionId', getCollectionProducts);
router.put('/cancelOrder/:orderId',User.cancelOrder);
// router.post('/cancelOrder/:orderId', async (req, res) => {
//     const { orderId } = req.params;

//     try {
//         const order = await Order.findById(orderId);
//         if (!order) {
//             return res.status(404).json({ success: false, message: 'Order not found' });
//         }

//         // Update the order status to 'cancelled'
//         order.status = 'cancelled';
//         await order.save();

//         res.json({ success: true, message: 'Order cancelled successfully' });
//     } catch (error) {
//         console.error("Error cancelling order:", error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// });
router.post('/orders/:prodId/reviews', User.submitReview);
router.post('/logout', User.logout);


router.get('/ContactUs',User.getcontactus);
router.get('/contactUsform',User.getcontactusform);


router.get('/customize', (req, res) => {
    res.render("Customization.ejs");
});

router.post('/submitRequest', User.addRequest);


router.post('/submit-quiz', async (req, res) => {
    const { answers, result } = req.body;
    try {
        let products = [];
        if (result === 'egypt') {
            products = await Product.find({ collection_id: 'Egyptian' }).limit(4);
        } else if (result === 'india') {
            products = await Product.find({ collection_id: 'The Indian Collection' }).limit(4);
        } else if (result === 'minimalist') {
            products = await Product.find({ collection_id: '0' }).limit(4);
        }
        
        res.json({ message: 'Quiz submitted successfully!', products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'An error occurred while submitting the quiz.' });
    }
});
router.get('/quiz', User.renderQuizPage);







router.get('/Customization',User.getCustomizationImage);


module.exports = router;
