const User = require('../models/User');

// Register
exports.register = async (req, res) => {
    const { name, password, email } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send('Username, email, and password are required');
    }

    try {
        const existingUser = await User.findOne({ email });

        if(existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const user = new User({ name, password, email });
        await user.save();

        const token = await user.generateAuthToken();

        return res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const user = await User.findOne({ email });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).send('Invalid email or password');
        }

        const token = await user.generateAuthToken();

        return res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};