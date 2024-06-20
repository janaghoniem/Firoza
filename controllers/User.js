const User = require('../models/User');
const Product = require('../models/product');
const bcrypt = require('bcrypt');
const Orderr = require('../models/Orders');
const collections = require('../models/Collections');
const Review = require('../models/reviews');
const Request = require('../models/Requests');
const QuizResult = require('../models/Quiz');

const getCollection = async (req, res) => {
    try {
        const formattedCollectionName = req.params.collectionName;
        const collectionName = formattedCollectionName.replace(/-/g, ' ');

        const collection = await Collection.findOne({ Collection_Name: collectionName });
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
}


async function getIndianProducts(req, res) {
    try {
        // Fetch the collection details
        const collection = await collections.findOne({ Collection_Name: 'The Indian Collection' });

        if (!collection) {
            return res.status(404).send('Collection not found');
        }

        // Fetch products associated with this collection
        const products = await Product.find({ collection_id: collection.Collection_Name });
        console.log('collection name', collection.Collection_Name);
        console.log('collection id', products.collection_id);

        // Render the template with collection and products
        res.render('indian', {

            img: collection.img,
            Collection_Name: collection.Collection_Name,
            Collection_Description: collection.Collection_Description,
            products: products // Pass products array to the template
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
}
const renderQuizPage = async (req, res) => {
    try {
        let latestQuizResult = null;
        if (req.session.user) {
            latestQuizResult = await QuizResult.findOne({ userId: req.session.user._id })
                .sort({ createdAt: -1 })
                .exec();
        }
        res.render('quiz', { latestQuizResult }); // Pass latestQuizResult to the template
    } catch (error) {
        console.error('Error rendering quiz page:', error);
        res.status(500).send('An error occurred while rendering the quiz page.');
    }

};

const storeQuizResults = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'Unauthorized. Please log in to submit quiz results.' });
        }

        const { answers, result } = req.body;

        const userId = req.session.user._id;

        // Store quiz results for the authenticated user
        const existingResult = await QuizResult.findOneAndUpdate(
            { userId: userId },
            { answers: answers, result: result, createdAt: Date.now() },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: 'Quiz results stored successfully.' });
    } catch (error) {
        console.error('Error storing quiz results:', error);
        res.status(500).json({ message: 'An error occurred while storing quiz results.', error: error.message });
    }

};


const GetUser = async (req, res) => {
    console.log('Entered GetUser function');

    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Email and password are required');
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Email not associated with any account');
            return res.status(400).json({ error: 'The entered email address is not associated with any account' });
        }
        const isAdmin = user.isAdmin;

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect password' });
        }

        // Merge guest cart with user cart
        if (req.session.cart && req.session.cart.items.length > 0) {
            req.session.cart.items.forEach(sessionItem => {
                if (!sessionItem.productId) {
                    console.log(`Missing productId for session item: ${JSON.stringify(sessionItem)}`);
                    return; // Skip this session item
                }
                const existingItem = user.cart.items.find(dbItem => dbItem.productId && dbItem.productId.toString() === sessionItem.productId.toString());
                if (existingItem) {
                    existingItem.quantity += sessionItem.quantity;
                } else {
                    // Ensure sessionItem has necessary fields
                    if (!sessionItem.price || !sessionItem.quantity) {
                        console.log(`Missing price or quantity for product ${sessionItem.productId}`);
                        return;
                    }
                    user.cart.items.push(sessionItem);
                }
            });

            // Update total price in user's cart
            user.cart.totalprice += req.session.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

            await user.save();
            req.session.cart.items = []; // Clear the session cart after merging
            req.session.cart.totalprice = 0; // Reset session cart total price
        }

        // Merge guest wishlist with user wishlist
        if (req.session.wishlist && req.session.wishlist.length > 0) {
            req.session.wishlist.forEach(sessionItem => {
                if (!sessionItem.productId) {
                    console.log(`Missing productId for wishlist item: ${JSON.stringify(sessionItem)}`);
                    return; // Skip this session item
                }
                const existingItem = user.wishlist.find(dbItem => dbItem.productId && dbItem.productId.toString() === sessionItem.productId.toString());
                if (!existingItem) {
                    user.wishlist.push(sessionItem); // Assuming sessionItem has been properly populated with productId references
                }
            });
            await user.save();
            req.session.wishlist = []; // Clear the session wishlist after merging
        }

        // Set session
        req.session.user = user;

        // Return user data including isAdmin flag
        res.status(200).json({ user, isAdmin });
    } catch (error) {
        console.error('Error in GetUser:', error);
        res.status(500).json({ error: 'Internal server error' });
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
            address,
            cart: {
                items: [],
                totalprice: 0
            }
        });

        await newUser.save();
        req.session.user = newUser;

        // Merge guest cart with new user cart
        if (req.session.cart && req.session.cart.items) {
            newUser.cart.items = req.session.cart.items;
            await newUser.save();
            req.session.cart.items = []; // Clear the session cart after merging
        }

        // Merge guest cart with new user cart
        if (req.session.wishlist) {
            newUser.wishlist = req.session.wishlist;
            await newUser.save();
            req.session.wishlist = []; // Clear the session cart after merging
        }

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { firstname, lastname, email } = req.body;
        const userId = req.session.user._id;


        // Only set the fields that are provided in the request
        const updatedInfo = {};
        if (firstname) updatedInfo.firstname = firstname.trim();
        if (lastname) updatedInfo.lastname = lastname.trim();
        if (email) updatedInfo.email = email.trim();

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updatedInfo },
            { new: true }
        );

        console.log('User updated.');
        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating user info:', error);
        res.status(500).send('Internal Server Error');
    }
}

const DeleteUser = async (req, res) => {
    console.log('entered delete function');
    try {
        const userId = req.session.user._id;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            console.log('no user.');
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Remove the user's orders
        // await Order.deleteMany({ user: userId });

        // // Remove the user's reviews
        // await Review.deleteMany({ user: userId });

        // Remove the user account
        await User.findByIdAndDelete(userId);

        // Destroy the session and clear the cookie
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send('Failed to deactivate account. Please try again later.');
            }
            console.log('Account deactivated successfully');
            return res.status(200).json({ success: true, message: 'Account deactivated successfully' });
        });
    } catch (error) {
        console.error('Error deactivating account:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while deactivating the account' });
    }
};


const checkUpdateEmailAvailibility = async (req, res) => {
    console.log('check update email availability.')
    const { emailValue } = req.body;
    try {
        const user = await User.findOne({ email: emailValue });
        const available = (!user ||  user._id.toString() === req.session.user._id);
        res.json({ available });
    } catch (error) {
        console.error('Error checking email availability:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Check Address
const checkAddress = async (req, res) => {
    console.log('enta beted5ol hena aslun?');
    const { address } = req.body;
    console.log("address: " + address);

    if (address) {
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
        res.status(500).json({ error: "undefined email" })
    }
}

// Check Login
const checkLoggedIn = async (req, res) => {
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
const filterProducts = async (req, res) => {
    console.log("Filters received:", req.body); // Debugging information

    const { categories, colors, priceRange, materials, sortBy, hideSoldOut } = req.body;
    const filters = {};

    if (categories && categories.length) filters.category = { $in: categories };
    if (colors && colors.length) filters.color = { $in: colors };
    if (materials && materials.length) filters.material = { $in: materials };
    if (priceRange) filters.price = { $lte: priceRange };

    // Filter for products that are not sold out
    if (hideSoldOut) {
        filters['sizes.quantity'] = { $gt: 0 };
    }

    let sortOption = {};
    if (sortBy === 'lowToHigh') {
        sortOption.price = 1;
    } else if (sortBy === 'highToLow') {
        sortOption.price = -1;
    }

    // console.log("Filters applied:", filters); // Debugging information
    // console.log("Sort option applied:", sortOption); // Debugging information

    try {
        const products = await Product.find(filters).sort(sortOption);
        // Add a field indicating if the product is sold out
        const productsWithStockInfo = products.map(product => {
            const isSoldOut = product.sizes.every(size => size.quantity === 0);
            return {
                ...product.toObject(),
                isSoldOut
            };
        });
        // console.log("Filtered products:", productsWithStockInfo); // Debugging information
        res.status(200).json(productsWithStockInfo);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

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
    console.log('entered add to cart');
    const { productId, price } = req.body;
    console.log('req body valid')
    if (!productId) {
        console.log('product undefined')
    }
    try {
        console.log('try entered')
        const product = await Product.findById(productId);
        if (!product) {
            console.log('product not found')
            return res.status(404).json({ error: 'Product not found' });
        }
        console.log('product found')
        if (!req.session.user) {
            console.log('guest user')
            if (!req.session.cart) {
                console.log('guest cart');
                req.session.cart = { items: [] };
            }
            const existingCartItem = req.session.cart.items.find(item => item.productId.toString() === productId.toString());
            if (existingCartItem) {
                console.log('existing cart item')
                existingCartItem.quantity += 1;
            } else {
                console.log('pushing cart item')
                req.session.cart.items.push({
                    productId: productId,
                    quantity: 1,
                    price: price
                });
            }
            console.log('product added to guest cart successfully')
            return res.status(200).json({ message: 'Product added to guest cart successfully' });
        }

        console.log('user');
        const user = await User.findById(req.session.user._id);
        const existingCartItem = user.cart.items.find(item => item.productId.toString() === productId.toString());
        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            user.cart.items.push({
                productId: productId,
                quantity: 1,
                price: price
            });
        }

        user.cart.totalprice = user.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        await user.save();
        console.log('product added to user cart successfully')
        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const Cart = async (req, res) => {
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
}


const getCartDetails = async (userId) => {
    if (userId) {
        // If there's a logged-in user, fetch cart items from database
        const user = await User.findById(userId).populate('cart.items.productId');
        if (!user) {
            throw new Error('User not found');
        }
        return user.cart;
    }

    // If there's no logged-in user, use session cart items
    const cartItems = await Promise.all(sessionCartItems.map(async item => {
        const product = await Product.findById(item.productId);
        return {
            productId: product._id, // Use product._id instead of product itself
            quantity: item.quantity,
            price: item.price
        };
    }));

    return { items: cartItems };
};


const updateCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Find the correct size variant and check quantity
        const sizeVariant = product.sizes.find(size => size.quantity >= quantity);

        if (!sizeVariant) {
            return res.status(400).json({ error: 'Insufficient product quantity available.' });
        }

        if (!req.session.user) {
            // Guest user
            if (!req.session.cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }

            const cartItem = req.session.cart.items.find(item => item.productId.toString() === productId.toString());

            if (!cartItem) {
                return res.status(404).json({ error: 'Item not found in cart' });
            }

            cartItem.quantity = quantity;

            // Calculate total price directly
            let totalPrice = 0;
            for (const item of req.session.cart.items) {
                totalPrice += item.price * item.quantity;
            }
            req.session.cart.totalprice = totalPrice;

            return res.status(200).json({ message: 'Cart updated successfully', totalprice: req.session.cart.totalprice });
        }

        // Logged-in user
        const user = await User.findById(req.session.user._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const cartItem = user.cart.items.find(item => item.productId.toString() === productId.toString());

        if (!cartItem) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        cartItem.quantity = quantity;

        // Calculate total price directly
        let totalPrice = 0;
        for (const item of user.cart.items) {
            totalPrice += item.price * item.quantity;
        }
        user.cart.totalprice = totalPrice;

        await user.save();

        res.status(200).json({ message: 'Cart updated successfully', totalprice: user.cart.totalprice });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateCartPrice = async (req, res) => {
    try {
        const { totalPrice } = req.body;

        if (typeof totalPrice !== 'number' || isNaN(totalPrice)) {
            return res.status(400).json({ error: 'Invalid total price' });
        }

        const userId = req.session.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Assuming the user has a cart field which stores cart details
        user.cart.totalprice = totalPrice;
        await user.save();

        res.status(200).json({ message: 'Cart price updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
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
            user.cart.items = user.cart.items.filter(item => item.productId.toString() !== productId.toString());
            user.cart.totalprice = user.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

            await user.save();

            console.log('Product removed from user cart successfully');
            res.status(200).json({ message: 'Product removed from cart successfully' });
        } else if (req.session.cart) {
            // Guest user
            req.session.cart.items = req.session.cart.items.filter(item => item.productId.toString() !== productId.toString());
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

const Checkout = async (req, res) => {
    console.log('checkout');
    const { billingData, shipping_address } = req.body;

    try {
        // Check if user is logged in
        if (!req.session.user) {
            return res.status(403).json({ error: 'Guest users cannot checkout. Please log in or create an account.' });
        }

        const user = await User.findById(req.session.user);

        const cartData = await getCartDetails(user._id);
        console.log('cart data fetched');

        const newOrder = new Orderr({
            user_id: req.session.user._id,
            product_ids: cartData.items.map(item => item.productId),
            total_price: cartData.totalprice,
            status: 'pending',
            shipping_address: {
                address: shipping_address.address,
                city: shipping_address.city,
                state: shipping_address.state,
                postal_code: shipping_address.postal_code,
            },
            payment_method: 'credit_card', // Assuming this is fixed or handled differently
        });
        console.log('new order created');

        // Save the order to the database
        const savedOrder = await newOrder.save();
        console.log('new order saved.');

        // Decrease available quantities of products
        await Promise.all(cartData.items.map(async item => {
            const dbProduct = await Product.findById(item.productId);
            if (!dbProduct) {
                console.log('product not found');
                throw new Error(`Product with ID ${item.productId} not found`);
            }
            // Decrease the available quantity
            console.log('decreasing quantity');
            dbProduct.quantity -= item.quantity;
            dbProduct.no_sales += item.quantity; // Assuming item.quantity represents the number of this product in the order
            await dbProduct.save();
        }));

        // Add order reference to user's order history (assuming a user model with order references)
        user.orders.push(savedOrder._id);
        await user.save();
        console.log('saved order history.');

        // Clear user's cart after successful checkout
        user.cart = {
            items: [],
            totalprice: 0
        };
        await user.save();
        console.log('cleared user cart.');

        res.status(200).json();
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ error: 'Failed to create order' });
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


const getUserOrder = async (req, res) => {
    try {
        // Check if the user is authenticated and their ID is available in the session
        if (!req.session.user || !req.session.user._id) {
            return res.status(403).send('User not authenticated');
        }

        const userId = req.session.user._id;

        const userInfo = await User.findById(req.session.user._id);

        // console.log('User information:', userInfo);
        // Find orders for the current user by their user ID
        const ordersUser = await Orderr.find({ user_id: userId })
            .populate({
                path: 'product_ids',
                select: 'name img price',
                model: 'Product'
            });

        // console.log('Orders for user:', ordersUser); // Log the orders

        res.render('myAccount', { ordersUser, userInfo }); // Pass ordersUser to the EJS template
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).render('error', { error });
    }
};


//Billing Information - Checkout
const BillingInformation = async (req, res) => {
    try {
        const { shipping_address } = req.body; // Use single underscore to match the schema

        // Validate the shipping address
        if (!shipping_address || !shipping_address.address || !shipping_address.city || !shipping_address.state || !shipping_address.postal_code) {
            return res.status(400).json({ error: 'Incomplete shipping address' });
        }

        // Find the user by session user ID
        if (!req.session.user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = await User.findById(req.session.user._id);

        // Ensure user.shipping_address is initialized as an array
        user.shipping_address = user.shipping_address || [];

        // Custom function to check for duplicate addresses
        const isDuplicateAddress = (newAddress) => {
            return user.shipping_address.some(addr => (
                addr.address.toLowerCase() === newAddress.address.toLowerCase() &&
                addr.city.toLowerCase() === newAddress.city.toLowerCase() &&
                addr.state.toLowerCase() === newAddress.state.toLowerCase() &&
                addr.postal_code === newAddress.postal_code
            ));
        };

        // Check if the new address already exists in the user's array
        if (isDuplicateAddress(shipping_address)) {
            return res.status(200).json({ message: 'Address already exists' });
        }

        // If address doesn't exist, add it to the array
        user.shipping_address.push({
            address: shipping_address.address,
            city: shipping_address.city,
            state: shipping_address.state,
            postal_code: shipping_address.postal_code
        });

        await user.save();

        res.status(200).json({ message: 'Billing information updated successfully' });
    } catch (error) {
        console.error('Error updating billing information:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//WISHLIST
const getWishlist = async (req, res) => {
    try {
        if (!req.session.user) {
            const sessionWishlist = req.session.wishlist ? req.session.wishlist : [];

            const wishlistItems = await Promise.all(sessionWishlist.map(async itemId => {
                const product = await Product.findById(itemId).lean();
                return product;
            }));

            return res.render('Wishlist', {
                wishlist: wishlistItems,
                user: null
            });
        }

        const user = await User.findById(req.session.user._id).populate({
            path: 'wishlist',
            model: 'Product'
        }).lean();

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('Wishlist', {
            wishlist: user.wishlist,
            user: user
        });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).send('Internal Server Error');
    }
};



const AddToWishlist = async (req, res) => {
    console.log('entered wishlist addition function');
    const { productId } = req.body;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (!req.session.user) {
            // Guest user handling
            if (!req.session.wishlist) {
                req.session.wishlist = [];
            }

            // Check if the product is already in the wishlist
            if (req.session.wishlist.includes(productId.toString())) {
                return res.status(200).json({ message: 'Product already in guest wishlist' });
            } else {
                req.session.wishlist.push(productId.toString());
            }

            return res.status(200).json({ message: 'Product added to guest wishlist successfully' });
        }

        // Logged-in user handling
        const user = await User.findById(req.session.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the product is already in the user's wishlist
        if (user.wishlist.includes(productId.toString())) {
            return res.status(200).json({ message: 'Product already in wishlist' });
        } else {
            user.wishlist.push(productId.toString());
        }

        await user.save();
        res.status(200).json({ message: 'Product added to wishlist successfully' });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const removeFromWishlist = async (req, res) => {
    const productId = req.params.productId;

    try {
        if (req.session.user) {
            // Logged-in user
            const user = await User.findById(req.session.user._id);
            if (!user) {
                return res.status(404).send('User not found');
            }

            // Filter out the product from the user's wishlist
            user.wishlist = user.wishlist.filter(item => item.toString() !== productId.toString());

            await user.save();

            res.status(200).json({ message: 'Product removed from wishlist successfully' });
        } else if (req.session.wishlist) {
            // Guest user
            req.session.wishlist = req.session.wishlist.filter(item => item.toString() !== productId.toString());

            res.status(200).json({ message: 'Product removed from guest wishlist successfully' });
        } else {
            res.status(404).send('No wishlist found in session');
        }
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).send('Internal Server Error');
    }
}



// const getIndianProducts = async (req, res) => {
//     try {
//         const indianProducts = await Product.find({ collection_id: '2' }); // Fetch products with collection_id '2'

//         res.render('indian', { products: indianProducts });
//       } catch (error) {
//         console.error('Error fetching Indian collection products:', error);
//         res.status(500).send('Server Error');
//       }
// };

const getShopAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('shopAll', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};



// const getCollectionProducts = async (req, res) => {
//     const collectionId = req.params.collectionId;
//     try {
//         const collection = await Collection.findById(collectionId); // Assuming you have a Collection model
//         const products = await Product.find({ collection_id: collectionId });

//         res.render('collection', {
//             collectionName: collection.name,
//             collectionDescription: collection.description,
//             collectionImage: collection.image,
//             collectionFolder: collection.folder, // Assuming you have a folder attribute for different collections
//             products: products
//         });
//     } catch (error) {
//         console.error('Error fetching collection products:', error);
//         res.status(500).send('Server Error');
//     }
// };


// try {
//     const { id } = req.params;
//     const deletedProduct = await Product.findByIdAndDelete(id);

//     if (!deletedProduct) {
//         return res.status(404).json({ error: 'Product not found' });
//     }

//     const users = await User.find({ 'cart.productId': id });

//     for (const user of users) {
//         user.cart = user.cart.filter(item => item.productId.toString() !== id.toString());
//         await user.save();
//     }

//     res.status(200).json({ message: 'Product deleted successfully' });
// } catch (error) {
//     console.error('Error deleting product:', error);
//     res.status(500).json({ error: 'Server error' });
// }

const cancelOrder = async (req, res) => {

    console.log("hiiiiii");
    try {
        const { orderId } = req.params;
        const order = await Orderr.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }


        order.status = 'cancelled';
        await order.save();

        res.json({ success: true, message: 'Order cancelled successfully' });
    } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
// const submitReview = async (req, res) => {
//     const { orderId } = req.params;
//     const { rating, comment } = req.body;

//     try {
//         const newReview = new reviews({
//             order: orderId,
//             rating: rating,
//             comment: comment
//         });

//         await newReview.save();

//         res.status(201).json({ success: true, message: 'Review submitted successfully' });
//     } catch (error) {
//         console.error('Error submitting review:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };

const submitReview = async (req, res) => {



    try {
        const { prodId } = req.params;
        const { rating, comment } = req.body;


        if (req.session.user) {
            // Logged-in user
            const userId = await User.findById(req.session.user._id);

            const newReview = new Review({
                prod: prodId,
                user: userId,
                rating: rating,
                comment: comment
            });
    
            await newReview.save();
    
            if (!userId) {
                return res.status(404).send('User not found');
            }

        }
       
        res.status(201).json({ success: true, message: 'Review submitted successfully' });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to log out' });
        }
        res.clearCookie('connect.sid'); // Assuming you're using express-session
        res.json({ success: true, message: 'Logged out successfully' });
    });
};


const getcontactus = async (req, res) => {
    res.render("ContactUs.ejs");
};

const getcontactusform = async (req, res) => {
    res.render("ContactUsForm.ejs");
};

const addRequest = async (req, res) => {
    try {
        const { firstName, lastName, email, subject, reason } = req.body;

        const newRequest = new Request({
            firstName,
            lastName,
            email,
            subject,
            approvement: null,
            reason
        });

        await newRequest.save();
        res.status(201).json({ message: 'Request submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getProductDetails = async (req, res) => {
    try {
        const productId = req.params.productId;
        let reviews;
        
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }
         reviews = await Review.find({ prod: productId }).populate('user');
        // Render productCardDetails.ejs with product data
        res.render('productCardDetails', {
            product: product,
            reviews: reviews
        });
    } catch (err) {
        console.error('Error fetching product details:', err);
        return res.status(500).send('Internal Server Error');
    }
};


const getCustomizationImage = async (req, res) => {
    try {
        const { stone, color } = req.params;
        const customItem = await custom.findOne({ stone, color });

        if (!customItem) {
            return res.status(404).send('Item not found');
        }

        res.json({ img2: customItem.img2 });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getCollectionPage = async (req, res) => {
    try {
        const allCollections = await collections.find({});

        // Render the template with the fetched collections
        res.render('Collections', { allCollections });
    } catch (error) {
        console.error('Error fetching collections:', error);
        res.status(500).send('Internal Server Error');
    }
}

// const getReviewsByProductId = async (req, res) => {
//     try {

//         console.log("jjjjjjj");
//         const { prodId } = req.params;
//         const reviews = await reviews.find({ prod: prodId }).populate('user', 'name');

//         if (!reviews) {
//             return res.status(404).json({ success: false, message: 'No reviews found for this product' });
//         }

//         res.status(200).json({ success: true, reviews });
//     } catch (error) {
//         console.error('Error fetching reviews:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };

const getTopSellingProducts = async () => {
    try {
        const topProducts = await Product.aggregate([
            { $sort: { no_sales: -1 } }, // Sort by no_sales descending
            { $limit: 10 } // Limit to top 5
        ]);

        return topProducts;
    } catch (error) {
        console.error('Error fetching top selling products:', error);
        throw error;
    }
};

module.exports = {
    GetUser,
    AddUser,
    updateUser,
    DeleteUser,
    checkUpdateEmailAvailibility,
    checkAddress,
    checkLoggedIn,
    Search,
    AddToCart,
    Cart,
    updateCart,
    updateCartPrice,
    removeFromCart,
    Checkout,
    getWishlist,
    AddToWishlist,
    removeFromWishlist,
    getUserById,
    BillingInformation,
    filterProducts,
    getUserOrder,
    getShopAllProducts,
    getIndianProducts,
    getCollection,
    cancelOrder,
    submitReview,
    logout,
    getcontactus,
    getcontactusform,
    addRequest,
    storeQuizResults,
    renderQuizPage,
    getCustomizationImage,
    getProductDetails,
    getTopSellingProducts, 
    getCollectionPage


};
