import User from "../models/User.js";

export class UserController {
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
