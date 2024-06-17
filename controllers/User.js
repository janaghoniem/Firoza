const User = require('../models/User'); 
const Product = require('../models/product');
const bcrypt = require('bcrypt');
// const natural = require('natural');
// const spellcheck = new natural.Spellcheck(['gold', 'silver', 'red']); // Extend with relevant terms


// Handle User login
const GetUser = async (req, res) => {
    console.log('da5al el getuser function');

    const { email, password } = req.body;

    if (!email || !password) {
        console.log('moshkela fel mail or password')
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('el mafrood yed5ol hena.');
            console.log(email);
            return res.status(400).json({ error: 'The entered email address is not associated with any account' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect password' });
        }

        // Set session
        req.session.user = user;
        const isAdmin = user.isAdmin;

        // Return user data including isAdmin flag
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Handle User signup
const AddUser = async (req, res) => {
    console.log('da5alt fel add user?');
    const { firstname, lastname, email, password, address } = req.body;

    console.log('Received fields:', { firstname, lastname, email, password, address });

    if (!firstname || !lastname || !email || !password) {
        console.log('fy fields fadya');
        return res.status(400).json({ error: 'All fields are required' });
    }


    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        console.log('password before hashing: ' + password);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            address
        });

        await newUser.save();
        req.session.user = newUser;
        console.log('saved el new user');
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.log('yarab maykonsh feeh error. Ha3ayat walahy.')
        res.status(500).json({ error: error.message });
    }
};

// Check Address
const checkAddress = async (req, res) => {
    console.log('enta beted5ol hena aslun?');
    const { address } = req.body;
    console.log("address: " + address);

    if(address) {
        try {
            const userExists = await User.findOne({ email: address });
            if (userExists) {
                console.log('msh el mafrood yed5ol hena');
                return res.status(400).json({ error: 'Address already taken' });
            }
            console.log('el mafrood yed5ol hena');
            res.status(200).json({ message: 'Address is available' });
        } catch (error) {
            console.log('hal fy error masalan?')
            res.status(500).json({ error: "catch el checkAddress fy error" });
        }
    } else {
        res.status(500).json({error: "undefined email"})
    }
}

// Check Login
const checkLoggedIn = async(req, res) => {
    console.log('checking login');
    try {
        if (req.session.user) {
            console.log('user in session');
            res.status(200).json({ loggedIn: true });
        } else {
            console.log('please log in');
            res.status(200).json({ loggedIn: false });
        }
    } catch (error) {
        console.error('Error checking login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const Search = async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const regex = new RegExp(query, 'i'); // Case-insensitive search
        const products = await Product.find({
            $or: [
                { product_id: regex },
                { name: regex },
                { material: regex },
                { description: regex },
                { category: regex }, 
                { color: regex }
            ]
        }).limit(9); // Limit results to 10 for performance

        // let didYouMean = [];
        // if (products.length === 0) {
        //     didYouMean = spellcheck.getCorrections(query, 1);
        // }

        res.status(200).json({ products });

    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ error: 'Failed to search products' });
    }
}

const AddToCart = async (req, res) => {
    const { productId, price } = req.body;

    if (!req.session.user) {
        return res.status(401).send('User not logged in');
    }

    try {
        const user = await User.findById(req.session.user._id);
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        const existingCartItem = user.cart.find(item => {
            if (item.productId) {
                return item.productId.toString() === productId.toString();
            }
            return false;
        });
        if (existingCartItem) {
            existingCartItem.quantity += 1;
            existingCartItem.price = price;
        } else {
            user.cart.push({
                productId: productId,
                quantity: 1,
                price: price
            });
        }

        await user.save();
        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send('Internal Server Error');
    }
}

const Cart = async(req, res) => {
    if (!req.session.user) {
        console.log('no session');
        // return res.redirect('/login'); // Redirect to login if the user is not logged in
    }

    try {
        const user = await User.findById(req.session.user._id).populate('cart.productId');

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
}

const removeFromCart = async (req, res) => {
    console.log('da5al el remove from cart');
    const productId = req.params.productId;

    if (!req.session.user) {
        console.log('no user session');
        return res.status(401).send('User not logged in');
    }

    try {
        const user = await User.findById(req.session.user._id);

        // Remove the item from the user's cart
        user.cart = user.cart.filter(async item => { if (item.productId) {
            const product = await Product.findById(item.productId)._id;
            console.log('removing cart items')
            if(product) {
                return product.toString() !== productId.toString();
            }
        }});
        await user.save();

        res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).send('Internal Server Error');
    }
};

//get use4r  by id
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('user-detail', { user });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    GetUser,
    AddUser,
    checkAddress,
    checkLoggedIn,
    Search,
    AddToCart,
    Cart, 
    removeFromCart,
    getUserById
};
