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

module.exports = {
    GetUser,
    AddUser,
    checkAddress,
    Search
};
