const User = require('../models/User'); // Import your User model
const bcrypt = require('bcrypt');

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
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Handle User signup
const AddUser = async (req, res) => {
    const { firstname, lastname, email, password, address } = req.body;

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
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    GetUser,
    AddUser
};
