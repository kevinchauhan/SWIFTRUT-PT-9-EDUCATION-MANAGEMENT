import User from "../models/User.js";
import bcryptjs from "bcryptjs"

export class UserController {


    async createUser(req, res) {
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

    // List all users with optional filtering by role
    async listUsers(req, res) {
        try {
            const { role } = req.query;
            const filter = role ? { role } : {};
            const users = await User.find(filter).select("-password");
            res.status(200).json({ success: true, users });
        } catch (error) {
            console.error("Error in listUsers:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    // Update a user's role
    async updateUserRole(req, res) {
        try {
            const { userId, role } = req.body;

            if (!userId || !role) {
                return res.status(400).json({ success: false, message: "User ID and role are required" });
            }

            const validRoles = ["Admin", "Teacher", "Student"];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ success: false, message: "Invalid role" });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            user.role = role;
            await user.save();

            res.status(200).json({ success: true, message: "User role updated successfully", user });
        } catch (error) {
            console.error("Error in updateUserRole:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    // Delete a user
    async deleteUser(req, res) {
        try {
            const { userId } = req.params;

            const user = await User.findByIdAndDelete(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            res.status(200).json({ success: true, message: "User deleted successfully" });
        } catch (error) {
            console.error("Error in deleteUser:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}
