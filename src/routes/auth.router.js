import express from 'express';
import User from '../models/user.model.js';
import { isAuthenticated, validateLoginData, asyncHandler } from '../middlewares/index.js';

const router = express.Router();

//endpoint de login con validaciones de campos
router.post('/login', validateLoginData, asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if(!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    if(user.password !== password) {
        return res.status(400).json({ message: 'Invalid password' });
    }
    
    req.session.user = user;
    req.session.role = user.role;
    res.json({ message: 'Login successful' });
}));

//endpoint para deslogear al usuario
router.post('/logout', isAuthenticated, asyncHandler(async(req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout successful' });
}));

export default router;