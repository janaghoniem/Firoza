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
const Request = require('./models/Requests'); 

const app = express();
const port = 3000;

//database connection and sessions
const dbURI = 'mongodb+srv://firoza:firoza123@firoza.okdf9xk.mongodb.net/database-firoza?retryWrites=true&w=majority&appName=Firoza';
//const fetchCollections = require('./middleware/authentication');

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

app.get('/Collections', async (req, res) => {
    try {
        const allCollections = await collectiona.find({});

        // Render the template with the fetched collections
        res.render('Collections', { allCollections });
    } catch (error) {
        console.error('Error fetching collections:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/user/:collectionName', async (req, res) => {
    try {
        const formattedCollectionName = req.params.collectionName;
        const collectionName = formattedCollectionName.replace(/-/g, ' ');

        const collection = await collectiona.findOne({ Collection_Name: collectionName });
        console.log(collectionName);
        if (!collection) {
            return res.status(404).send('Collection not found');
        }

        const products = await Product.find({ collection_id: collection.Collection_Name });

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




// app.get('/EditProduct', (req, res) => {
//     res.render("EditProduct.ejs");
// });

// app.get('/indian', async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.render('indian', { products });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server error');
//     }
// });
// app.get('/shopAll', async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.render('shopAll', { products });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server error');
//     }
// });



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







// app.use('/', Product);

app.use((req, res) => {
    res.status(404).render('404', { user: (req.session.user === undefined ? "" : req.session.user) });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




//global error handling

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'An error occurred on the server. Please try again later.' });
// });


//Order data for Jana Ghoniem
// const order1 = new Order({
//     user_id: new mongoose.Types.ObjectId('6671369b45c4005caab95051'),
//     product_ids: [
//        new mongoose.Types.ObjectId('666f66f88e74f044945fb5fb'),
//         new mongoose.Types.ObjectId('666f66c68e74f044945fb5f8')
//     ],
//     total_price: 320000,
//     status: 'pending',
//     shipping_address: {
//         country: 'Egypt',
//         city: 'Cairo',
//         state: 'Cairo Governorate', // Add the state
//         street: '123 Nile Street',
//         address: 'Apartment 12', // Add the address
//         postal_code: 12345
//     },
//     Payment_method: 'credit_card' 
// });

// Order data forJana Ghoniem
// const order2 = new Order({
//     user_id: new mongoose.Types.ObjectId('6671369b45c4005caab95051'),
//     product_ids: [
//        new mongoose.Types.ObjectId('666f611c8f1bfa19966dd9f2')
//     ],
//     total_price: 120000,
//     status: 'delivered',
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


