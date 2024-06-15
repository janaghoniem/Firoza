const Users = require('../models/user');
const bcrypt = require('bcrypt');

// Add User (Sign Up)
const AddUser = async (req, res) => {
    const { firstname, lastname, email, password, address } = req.body;

    try {
        // Check if user already exists
        const userExists = await Users.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new Users({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            address
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get User (Log In)
const GetUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Set session
        req.session.user = user;
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Check Address
const checkAddress = async (req, res) => {
    const { address } = req.body;

    try {
        const userExists = await Users.findOne({ address });
        if (userExists) {
            return res.status(400).json({ error: 'Address already taken' });
        }

        res.status(200).json({ message: 'Address is available' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Edit User Profile
const editUser = async (req, res) => {
    const userId = req.session.user._id;
    const { password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await Users.findByIdAndUpdate(userId, { password: hashedPassword });
        req.session.user.password = hashedPassword;
        res.status(200).json({ message: 'Profile updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    AddUser,
    GetUser,
    checkAddress,
    editUser
};
