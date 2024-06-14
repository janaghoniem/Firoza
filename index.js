const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product'); 
const fs = require('fs');

const app = express();
const port = 3000;

const dbURI = 'mongodb+srv://firoza:firoza123@firoza.okdf9xk.mongodb.net/database-firoza?retryWrites=true&w=majority&appName=Firoza';
const passwordAdmin = 'firoza123';

mongoose.connect(dbURI).then((result) => {
    console.log('connected to database!');
}).catch((err) => {
    console.log(err);
});

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the landing page
app.get('/', (req, res) => {
    res.render('Landing-page');
});

// Shahd's part
app.get('/admin', (req, res) => {
    res.render("main.ejs");
});

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

app.get('/EditProduct', (req, res) => {
    res.render("EditProduct.ejs");
});

app.get('/admin/product', (req, res) => {
    res.render("Admin-products.ejs");
});

app.get('/Orders', (req, res) => {
    res.render("admin-orders.ejs");
});

app.get('/layout', (req, res) => {
    res.render("EditLayout.ejs");
});

// End of Shahd's part 
app.get('/stores', (req, res) => {
    res.render("stores.ejs");
});

app.get('/indian', (req, res) => {
    res.render('indian');
});

app.get('/shoppingcart', (req, res) => {
    res.render("ShoppingCart.ejs");
});

app.get('/WishList', (req, res) => {
    res.render("wishlist.ejs");
});

app.get('/Checkout', (req, res) => {
    res.render("Checkout.ejs");
});

// MongoDB
app.get('/add-product', (req, res) => {
    const product = new Product({
        product_id: 'unique-id',  
        collection_id: 'collection-id',  
        name: 'new product',
        description: 'product description',
        category: 'category',
        price: 100,  
        img: 'image-url-or-path',  
        no_pieces: 10,  
        rating: 4.5,  
        material: 'material description',
        color: 'color description',
        no_sales: 0  
    });
    product.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
