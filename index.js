const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const userRouter = require('./routes/user'); 
const AdminRouter = require('./routes/admin'); 
const appRouter = require('./routes/app');
const User = require('./models/User');
const Product = require('./models/product'); 
const Order = require('./models/Orders'); 
const collectiona = require('./models/Collections');
const Request = require('./models/Requests'); 
const Customa = require('./models/Customization'); 

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
app.use('/',appRouter);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));





// app.get('/admin', (req, res) => {
//     res.render("main.ejs");
// });

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

// const stonePrices = {
//     'Round': 7500,
//     'Radiant': 7000,
//     'Heart': 4000,
//     'Princess': 2500,
//     'Pear': 6000,
//     'Oval': 6500,
//     'Marquise': 5500,
//     'Emerald': 9000,
//     'Cushion': 8000,
//     'Asscher': 6000
// };

// const colorPrices = {
//     'White': 2000,
//     'Green': 3000,
//     'Blue': 2500,
//     'Yellow': 1000,
//     'Red': 4000
// };

// const combinations = [
//     { stone: 'Round', color: 'White' },
//     { stone: 'Round', color: 'Green' },
//     { stone: 'Round', color: 'Blue' },
//     { stone: 'Round', color: 'Yellow' },
//     { stone: 'Round', color: 'Red' },

//     { stone: 'Radiant', color: 'White' },
//     { stone: 'Radiant', color: 'Green' },
//     { stone: 'Radiant', color: 'Blue' },
//     { stone: 'Radiant', color: 'Yellow' },
//     { stone: 'Radiant', color: 'Red' },

//     { stone: 'Heart', color: 'White' },
//     { stone: 'Heart', color: 'Green' },
//     { stone: 'Heart', color: 'Blue' },
//     { stone: 'Heart', color: 'Yellow' },
//     { stone: 'Heart', color: 'Red' },

//     { stone: 'Princess', color: 'White' },
//     { stone: 'Princess', color: 'Green' },
//     { stone: 'Princess', color: 'Blue' },
//     { stone: 'Princess', color: 'Yellow' },
//     { stone: 'Princess', color: 'Red' },

//     { stone: 'Pear', color: 'White' },
//     { stone: 'Pear', color: 'Green' },
//     { stone: 'Pear', color: 'Blue' },
//     { stone: 'Pear', color: 'Yellow' },
//     { stone: 'Pear', color: 'Red' },

//     { stone: 'Oval', color: 'White' },
//     { stone: 'Oval', color: 'Green' },
//     { stone: 'Oval', color: 'Blue' },
//     { stone: 'Oval', color: 'Yellow' },
//     { stone: 'Oval', color: 'Red' },

//     { stone: 'Marquise', color: 'White' },
//     { stone: 'Marquise', color: 'Green' },
//     { stone: 'Marquise', color: 'Blue' },
//     { stone: 'Marquise', color: 'Yellow' },
//     { stone: 'Marquise', color: 'Red' },

// const combinations = [
//     { stone: 'Round', color: 'White' },
//     { stone: 'Round', color: 'Green' },
//     { stone: 'Round', color: 'Blue' },
//     { stone: 'Round', color: 'Yellow' },
//     { stone: 'Round', color: 'Red' },

//     { stone: 'Radiant', color: 'White' },
//     { stone: 'Radiant', color: 'Green' },
//     { stone: 'Radiant', color: 'Blue' },
//     { stone: 'Radiant', color: 'Yellow' },
//     { stone: 'Radiant', color: 'Red' },

//     { stone: 'Heart', color: 'White' },
//     { stone: 'Heart', color: 'Green' },
//     { stone: 'Heart', color: 'Blue' },
//     { stone: 'Heart', color: 'Yellow' },
//     { stone: 'Heart', color: 'Red' },

//     { stone: 'Princess', color: 'White' },
//     { stone: 'Princess', color: 'Green' },
//     { stone: 'Princess', color: 'Blue' },
//     { stone: 'Princess', color: 'Yellow' },
//     { stone: 'Princess', color: 'Red' },

//     { stone: 'Pear', color: 'White' },
//     { stone: 'Pear', color: 'Green' },
//     { stone: 'Pear', color: 'Blue' },
//     { stone: 'Pear', color: 'Yellow' },
//     { stone: 'Pear', color: 'Red' },

//     { stone: 'Oval', color: 'White' },
//     { stone: 'Oval', color: 'Green' },
//     { stone: 'Oval', color: 'Blue' },
//     { stone: 'Oval', color: 'Yellow' },
//     { stone: 'Oval', color: 'Red' },

//     { stone: 'Marquise', color: 'White' },
//     { stone: 'Marquise', color: 'Green' },
//     { stone: 'Marquise', color: 'Blue' },
//     { stone: 'Marquise', color: 'Yellow' },
//     { stone: 'Marquise', color: 'Red' },

//     { stone: 'Emerald', color: 'White' },
//     { stone: 'Emerald', color: 'Green' },
//     { stone: 'Emerald', color: 'Blue' },
//     { stone: 'Emerald', color: 'Yellow' },
//     { stone: 'Emerald', color: 'Red' },

//     { stone: 'Cushion', color: 'White' },
//     { stone: 'Cushion', color: 'Green' },
//     { stone: 'Cushion', color: 'Blue' },
//     { stone: 'Cushion', color: 'Yellow' },
//     { stone: 'Cushion', color: 'Red' },

//     { stone: 'Asscher', color: 'White' },
//     { stone: 'Asscher', color: 'Green' },
//     { stone: 'Asscher', color: 'Blue' },
//     { stone: 'Asscher', color: 'Yellow' },
//     { stone: 'Asscher', color: 'Red' }
// ];

//     { stone: 'Emerald', color: 'White' },
//     { stone: 'Emerald', color: 'Green' },
//     { stone: 'Emerald', color: 'Blue' },
//     { stone: 'Emerald', color: 'Yellow' },
//     { stone: 'Emerald', color: 'Red' },


//     { stone: 'Cushion', color: 'White' },
//     { stone: 'Cushion', color: 'Green' },
//     { stone: 'Cushion', color: 'Blue' },
//     { stone: 'Cushion', color: 'Yellow' },
//     { stone: 'Cushion', color: 'Red' },

//     { stone: 'Asscher', color: 'White' },
//     { stone: 'Asscher', color: 'Green' },
//     { stone: 'Asscher', color: 'Blue' },
//     { stone: 'Asscher', color: 'Yellow' },
//     { stone: 'Asscher', color: 'Red' }
// ];

// function calculatePrice(stone, color) {
//     const stonePrice = stonePrices[stone];
//     const colorPrice = colorPrices[color];
//     return stonePrice + colorPrice;
// }

// async function debugDatabase() {
//     const indexes = await Customa.collection.getIndexes();
//     console.log('Indexes:', indexes);

//     const existingData = await Customa.find({});
//     console.log('Existing Data:', existingData);
// }

// debugDatabase();

// async function seedDatabase() {
//     try {
//         await Customa.deleteMany({}); // Clear existing data
//         await Customa.collection.drop();
//         console.log('Collection dropped successfully.');
//         for (let i = 0; i < combinations.length; i++) {
//             const { stone, color } = combinations[i];

//             // Check for invalid data
//             if (!stone || !color) {
//                 console.error(`Invalid combination at index ${i}:`, combinations[i]);
//                 continue; // Skip invalid entries
//             }


//             console.log(`Preparing to insert combination: ${stone}, ${color}`); // Detailed logging
//             const price = calculatePrice(stone, color);
//             const newCustom = new Customa({
//                 customize_id: `${stone}_${color}`, // Adjust customize_id format as needed
//                 price: price, // Set the price accordingly

// async function seedDatabase() {
//     try {
//         await Customa.deleteMany({}); // Clear existing data (optional)

//         for (let i = 0; i < combinations.length; i++) {
//             const { stone, color } = combinations[i];
//             const newCustom = new Customa({
//                 customize_id: `${stone}_${color}`, // Adjust customize_id format as needed
//                 price: 0, // Set the price accordingly

//                 img1: '', // Set image paths if applicable
//                 img2: '',
//                 stone: stone,
//                 color: color
//             });


//             try {
//                 await newCustom.save();
//                 console.log(`Inserted combination: ${stone}, ${color}`);
//             } catch (saveError) {
//                 console.error(`Error inserting combination ${stone}, ${color}:`, saveError.message);
//             }
//         }

//seedDatabase();

//             await newCustom.save();
//             console.log(`Inserted combination: ${stone}, ${color}`);
//         }

//         console.log('Database seeding completed.');
//         mongoose.connection.close();
//     } catch (err) {
//         console.error('Error seeding database:', err);
//     }
// }
// seedDatabase();
app.use((req, res) => {
    res.status(404).render('404', { user: (req.session.user === undefined ? "" : req.session.user) });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// app.get('/customize',customize);


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


