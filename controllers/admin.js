const User = require('../models/User');
const bcrypt = require('bcrypt');
const Product = require('../models/product');

// Function to add an admin
const addAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, password, contactNumber } = req.body;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new User({
            firstname: firstName,
            lastname: lastName,
            email,
            password: hashedPassword,
            isAdmin: true,
            address: [], // Optional field, can be updated if needed
            wishlist: [],
            orders: [],
            cart: [],
            Token: '',
            Tokenexpiry: null,
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addAdmin
};

//Function to add a product
