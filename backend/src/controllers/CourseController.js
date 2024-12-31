import Course from "../models/Course.js";
import User from "../models/User.js";

export class CourseController {
    // Create a new course (Admin only)
    async createCourse(req, res) {
        try {
            const { title, description, startDate, endDate, teacherId } = req.body;

            if (!title || !description || !startDate || !endDate || !teacherId) {
                return res.status(400).json({ success: false, message: "All fields are required" });
            }

            const teacher = await User.findById(teacherId);
            if (!teacher || teacher.role !== "Teacher") {
                return res.status(400).json({ success: false, message: "Invalid teacher ID" });
            }

            const course = new Course({
                title,
                description,
                startDate,
                endDate,
                teacher: teacherId,
            });

            await course.save();
            res.status(201).json({ success: true, message: "Course created successfully", course });
        } catch (error) {
            console.error("Error in createCourse:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    // Get all courses (Admin can see all; Teacher and Student see only assigned/enrolled courses)
    async getCourses(req, res) {
        try {
            const { role, id } = req.user;
            let courses = await Course.find().populate("teacher", "name email").populate("enrolledStudents", "_id name email");
            // if (role === "Admin") {
            // } else if (role === "Teacher") {
            //     courses = await Course.find({ teacher: id });
            // } else if (role === "Student") {
            //     courses = await Course.find({ enrolledStudents: id });
            // } else {
            //     return res.status(403).json({ success: false, message: "Unauthorized" });
            // }

            res.status(200).json({ success: true, courses });
        } catch (error) {
            console.error("Error in getCourses:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    // Update a course (Admin only)
    async updateCourse(req, res) {
        try {
            const { courseId } = req.params;
            const { title, description, startDate, endDate, teacherId } = req.body;

            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }

            if (teacherId) {
                const teacher = await User.findById(teacherId);
                if (!teacher || teacher.role !== "Teacher") {
                    return res.status(400).json({ success: false, message: "Invalid teacher ID" });
                }
                course.teacher = teacherId;
            }

            course.title = title || course.title;
            course.description = description || course.description;
            course.startDate = startDate || course.startDate;
            course.endDate = endDate || course.endDate;

            await course.save();
            res.status(200).json({ success: true, message: "Course updated successfully", course });
        } catch (error) {
            console.error("Error in updateCourse:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    // Delete a course (Admin only)
    async deleteCourse(req, res) {
        try {
            const { courseId } = req.params;

            const course = await Course.findByIdAndDelete(courseId);
            if (!course) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }

            res.status(200).json({ success: true, message: "Course deleted successfully" });
        } catch (error) {
            console.error("Error in deleteCourse:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}
