const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

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
//shahd's part

app.get('/admin', (req, res) => {
    res.render("main.ejs")
});

app.get('/Collections', (req, res) => {
    res.render("Collections")
});
  
  app.get('/AddCollection', (req, res) => {
    res.render("AddCollection.ejs")
  })
  
  app.get('/EditCollection', (req, res) => {
    res.render("EditCollection.ejs")
  })
  
  app.get('/AddProduct', (req, res) => {
    res.render("addProduct.ejs")
  })
  
  app.get('/EditProduct', (req, res) => {
    res.render("EditProduct.ejs")
  })

  

app.get('/indian', (req, res) => {
    res.render('indian');
});

app.get('/shoppingcart', (req, res) => {
  res.render("ShoppingCart.ejs")
})

app.get('/WishList', (req, res) => {
  res.render("wishlist.ejs")
})

app.get('/Checkout', (req, res) => {
  res.render("Checkout.ejs")
})


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

