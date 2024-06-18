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



//global error handling

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An error occurred on the server. Please try again later.' });
});




