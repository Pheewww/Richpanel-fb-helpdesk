import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const loginRoutes = express.Router();

loginRoutes.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('// LOGIN Begins');

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        console.log('// User Done');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        console.log('// Pwd Done');





        // Simplified token generation
        jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '10d' },

            (err, token) => {
                if (err) {
                    console.error("Error generating token:", err);
                    return res.status(500).json({ message: "Error generating token" });
                }
                console.log('// IN JWT SIGN BLOCK OF LOGIN ');

                res.json({ success: true, token: 'Bearer ' + token });
            }
        );

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


loginRoutes.post('/signup', async (req, res) => {
    const { name, email, password, dob } = req.body;

    try {

        console.log('// User Signup Begins');

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists. Try Login' });

        }

        user = new User({
            displayName: name,
            email,
            password,
            dob

        });

        await user.save();
        console.log('// User added in DB');

        res.status(201).json({ message: 'User successfully registered. Please log in.' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('Server error');
    }
});

export default loginRoutes;
