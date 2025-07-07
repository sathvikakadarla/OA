import express from 'express';
import bcrypt from 'bcryptjs'; // if using ES module syntax
import userModel from '../model/userModel.js'; // Adjust the path if necessary

const router = express.Router();

// Login API
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Successful login
        res.json({ success: true, message: 'Login successful', user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;