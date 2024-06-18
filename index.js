const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const bodyParser = require('body-parser');
//routers
const userRouter = require('./routes/user'); 
const AdminRouter = require('./routes/admin'); 
//models
const User = require('./models/User');
const Product = require('./models/product'); 
const Order = require('./models/Orders'); 
const collectiona = require('./models/Collections'); 

const app = express();
const port = 3000;

//database connection and sessions
const dbURI = 'mongodb+srv://firoza:firoza123@firoza.okdf9xk.mongodb.net/database-firoza?retryWrites=true&w=majority&appName=Firoza';

mongoose.connect(dbURI).then((result) => {
    console.log('connected to database!');
}).catch((err) => {
    console.log(err);
});

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // Example: 1 day in milliseconds
}));

//routers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', userRouter);
app.use('/admin',AdminRouter);


// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the landing page
app.get('/', (req, res) => {
    res.render('landing-page');
});

// app.get('/admin', (req, res) => {
//     res.render("main.ejs");
// });

app.get('/Collections', (req, res) => {
    res.render("Collections");
});



app.get('/AddCollection', (req, res) => {
    res.render("AddCollection.ejs");
});

app.get('/EditCollection', (req, res) => {
    res.render("EditCollection.ejs");
});

app.get('/Customize', (req, res) => {
    res.render("Customization.ejs");
});

app.get('/AddProduct', (req, res) => {
    res.render("addProduct.ejs");
});

// app.get('/EditProduct', (req, res) => {
//     res.render("EditProduct.ejs");
// });

app.get('/admin/product', (req, res) => {
    res.render("Admin-products.ejs");
});

app.get('/Orders', (req, res) => {
    res.render("admin-orders.ejs");
});

app.get('/EditLayout', (req, res) => {
    res.render("EditLayout.ejs");
});

// app.delete('/EditLayout/:id', adminController.deleteCollection);

app.get('/EditLayout', async (req, res) => {
    try {
        const collections = await collectiona.find({});
        res.status(500).json(collections);
    } catch (err) {
        res.status(500).json({messege: err.messege});
    }
});

app.get('/Users', (req, res) => {
    res.render("Users.ejs");
});

app.get('/stores', (req, res) => {
    res.render("stores.ejs");
});

app.get('/indian', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('indian', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
app.get('/shopAll', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('shopAll', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
// app.getEditProductPage('/EditProduct',async (req, res) => {
//     try {
//         const productId = req.params.id;
//         const product = await Product.findById(productId);
        
//         res.render('EditProduct',  { product } ); 
//     } catch (error) {
//         console.error('Error fetching product:', error);
//         res.status(500).send('Server error');
//     }
// }); 
    
app.get('/ShoppingCart', async (req, res) => {
    try {
        if (!req.session.user) {
            const sessionCart = req.session.cart ? req.session.cart.items : [];

            const cartItems = await Promise.all(sessionCart.map(async item => {
                const product = await Product.findById(item.productId);
                return {
                    productId: product,
                    quantity: item.quantity,
                    price: item.price
                };
            }));

            return res.render('ShoppingCart', {
                cart: { items: cartItems },
                user: null
            });
        }

        const user = await User.findById(req.session.user._id).populate('cart.items.productId');

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('ShoppingCart', {
            cart: user.cart,
            user: user
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/WishList', (req, res) => {
    res.render("wishlist.ejs");
});

app.get('/user/Checkout', (req, res) => {
    res.render("Checkout.ejs");
});

app.get('/AddAdmin',(req,res)=>{
    res.render("AddAdmin.ejs");
});



app.get('/myaccount',(req,res)=>{
    res.render("myAccount.ejs");
});



// app.use('/', Product);

app.use((req, res) => {
    res.status(404).render('404', { user: (req.session.user === undefined ? "" : req.session.user) });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.use('/products', userRouter);


//global error handling

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An error occurred on the server. Please try again later.' });
});


//Order data for Jana Ghoniem
const order1 = new Order({
    user_id: new mongoose.Types.ObjectId('6671369b45c4005caab95051'),
    product_ids: [
       new mongoose.Types.ObjectId('666f66f88e74f044945fb5fb'),
        new mongoose.Types.ObjectId('666f66c68e74f044945fb5f8')
    ],
    total_price: 320000,
    status: 'pending',
    shipping_address: {
        country: 'Egypt',
        city: 'Cairo',
        state: 'Cairo Governorate', // Add the state
        street: '123 Nile Street',
        address: 'Apartment 12', // Add the address
        postal_code: 12345
    },
    Payment_method: 'credit_card' 
});

// Order data forJana Ghoniem
// const order2 = new Order({
//     user_id: new mongoose.Types.ObjectId('6671369b45c4005caab95051'),
//     product_ids: [
//        new mongoose.Types.ObjectId('666f611c8f1bfa19966dd9f2')
//     ],
//     total_price: 120000,
//     status: 'pending',
//     shipping_address: {
//         country: 'Egypt',
//         city: 'Alexandria',
//         state: 'Alexandria Governorate', // Add the state
//         street: '456 Sea Road',
//         address: 'Villa 34', // Add the address
//         postal_code: 54321
//     },
//     Payment_method: 'credit_card'
// });

// // Save orders to the database
// order1.save()
//     .then(() => console.log('Order 1 saved successfully'))
//     .catch(err => console.error('Error saving Order 1:', err));

// order2.save()
//     .then(() => console.log('Order 2 saved successfully'))
//     .catch(err => console.error('Error saving Order 2:', err));