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

        // Merge guest cart with user cart
        if (req.session.cart) {
            req.session.cart.forEach(sessionItem => {
                const existingItem = user.cart.find(dbItem => dbItem.productId.toString() === sessionItem.productId.toString());
                if (existingItem) {
                    existingItem.quantity += sessionItem.quantity;
                } else {
                    user.cart.push(sessionItem);
                }
            });
            await user.save();
            req.session.cart = []; // Clear the session cart after merging
        }

        // Set session
        req.session.user = user;

        // Return user data including isAdmin flag
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Handle User signup
const AddUser = async (req, res) => {
    console.log('Entered AddUser function');
    const { firstname, lastname, email, password, address } = req.body;

    console.log('Received fields:', { firstname, lastname, email, password, address });

    if (!firstname || !lastname || !email || !password) {
        console.log('Missing fields');
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

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

        // Merge guest cart with new user cart
        if (req.session.cart) {
            newUser.cart = req.session.cart;
            await newUser.save();
            req.session.cart = []; // Clear the session cart after merging
        }

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
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

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (!req.session.user) {
            if (!req.session.cart) {
                req.session.cart = [];
            }
            const existingCartItem = req.session.cart.find(item => item.productId.toString() === productId.toString());
            if (existingCartItem) {
                existingCartItem.quantity += 1;
            } else {
                req.session.cart.push({
                    productId: productId,
                    quantity: 1,
                    price: price
                });
            }
            return res.status(200).json({ message: 'Product added to guest cart successfully' });
        }

        const user = await User.findById(req.session.user._id);
        const existingCartItem = user.cart.find(item => item.productId.toString() === productId.toString());
        if (existingCartItem) {
            existingCartItem.quantity += 1;
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const Cart = async(req, res) => {
    try {

        if (!req.session.user) {
            const sessionCart = req.session.cart || [];

            const cartItems = await Promise.all(sessionCart.map(async item => {
                const product = await Product.findById(item.productId);
                return {
                    productId: product,
                    quantity: item.quantity,
                    price: item.price
                };
            }));

            return res.render('ShoppingCart', {
                cart: cartItems,
                user: null
            });
        }

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
    console.log('Entered removeFromCart function');
    const productId = req.params.productId;

    try {
        if (req.session.user) {
            // Logged-in user
            const user = await User.findById(req.session.user._id);
            if (!user) {
                console.log('User not found');
                return res.status(404).send('User not found');
            }

            // Filter out the item from the user's cart
            user.cart = user.cart.filter(item => item.productId.toString() !== productId.toString());
            await user.save();

            console.log('Product removed from user cart successfully');
            res.status(200).json({ message: 'Product removed from cart successfully' });
        } else if (req.session.cart) {
            // Guest user
            req.session.cart = req.session.cart.filter(item => item.productId.toString() !== productId.toString());
            console.log('Product removed from guest cart successfully');
            res.status(200).json({ message: 'Product removed from guest cart successfully' });
        } else {
            console.log('No cart found in session');
            res.status(404).send('No cart found in session');
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).send('Internal Server Error');
    }
}

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

//Billing Information - Checkout
const BillingInformation = async (req, res) => {
    try {
        const { shipping_address } = req.body;

        // Update user's billing address in the database
        const user = await User.findById(req.session.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.shipping_address = {
            address: shipping_address.address,
            city: shipping_address.city,
            state: shipping_address.state,
            postal_code: shipping_address.postal_code
        };

        await user.save();

        res.status(200).json({ message: 'Billing information updated successfully' });
    } catch (error) {
        console.error('Error updating billing information:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



module.exports = {
    GetUser,
    AddUser,
    checkAddress,
    checkLoggedIn,
    Search,
    AddToCart,
    Cart, 
    removeFromCart,
    getUserById, 
    BillingInformation
};
