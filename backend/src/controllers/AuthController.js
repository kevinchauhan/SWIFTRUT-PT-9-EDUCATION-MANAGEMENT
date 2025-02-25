import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';

export class AuthController {
    async signup(req, res) {
        try {
            const { email, password, name, role = "Student" } = req.body;

            if (!email || !password || !name) {
                return res.status(400).json({ success: false, message: "All fields are required" });
            }

            if (role !== "Student" && req.user?.role !== "Admin") {
                return res.status(403).json({ success: false, message: "Only Admin can assign non-student roles" });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({ success: false, message: "Invalid email" });
            }

            if (password.length < 6) {
                return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
            }

            const existingUserByEmail = await User.findOne({ email });

            if (existingUserByEmail) {
                return res.status(400).json({ success: false, message: "Email already exists" });
            }

            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, salt);

            const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
            const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

            const newUser = new User({
                email,
                password: hashedPassword,
                name,
                role,
                image,
            });

            await generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                success: true,
                user: {
                    ...newUser._doc,
                    password: "",
                },
            });
        } catch (error) {
            console.log("Error in signup controller", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, message: "All fields are required" });
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }

            const isPasswordCorrect = await bcryptjs.compare(password, user.password);

            if (!isPasswordCorrect) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }

            await generateTokenAndSetCookie(user._id, res);

            res.status(200).json({
                success: true,
                user: {
                    ...user._doc,
                    password: "",
                },
            });
        } catch (error) {
            console.log("Error in login controller", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie("jwt-token");
            res.status(200).json({ success: true, message: "Logged out successfully" });
        } catch (error) {
            console.log("Error in logout controller", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    async self(req, res, next) {
        try {
            const user = await User.findById(req.user.id).select('-password')
            return res.json(user)
        } catch (error) {
            return next(error)
        }
    }


}
