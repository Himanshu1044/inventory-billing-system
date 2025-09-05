import express from 'express';
import User from '../models/user.js';
// import jwt from 'jsonwebtoken'

const router = express.Router();
//Registering new user

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, businessName } = req.body;

        if (!username || !email || !password || !businessName) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be 6 characters long',
            })
        }

        // Already existing user

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            })
        }

        // Now Creating new user
        const user = new User({
            username,
            email,
            password,
            businessName
        })
        await user.save();

        // const token = jwt.sign(
        //     { userId: user._id },
        //     process.env.JWT_SECRET || 'your_jwt_secret_key_here',
        //     { expiresIn: '7d' }
        // );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: user.toJSON()
        });


    } catch (err) {
        console.log('Register error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to register user',
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if ((!username && !email) || !password) {
            res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }
        // checking if user exist 
        const user = await User.findOne({
            $or: [{ email }, { username }]
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User does not exists'
            })
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Wrong Password',
            })
        }
        // Generating JWT token
        // const token = jwt.sign(
        //     { userId: user._id },
        //     process.env.JWT_SECRET || 'Backend Development',
        //     { expiresIn: '7d' }
        // )
        res.json({
            success: true,
            message: 'Login successful',
            // token,
            user: user.toJSON()
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error while logging'
        })
    }
})

// Logout route

// router.get('/logout', authenticateToken, (req, res) => {
//     res.json({
//         success: true,
//         message: 'Logout successful. Please remove the token from client side.'
//     });
// });

export default router;