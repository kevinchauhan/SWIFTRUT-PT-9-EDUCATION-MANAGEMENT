import jwt from 'jsonwebtoken';
import { Config } from '../config/index.js';
import User from '../models/User.js';

const authenticate = async (req, res, next) => {
    // Get token from Authorization header
    const token = req.cookies['jwt-token'] || req.headers.authorization?.split(' ')[1];

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ success: false, message: "Authentication failed, token not found" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, Config.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        // Attach the decoded user information to the request
        req.user = user;
        req.user.id = user._id
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authenticate;
