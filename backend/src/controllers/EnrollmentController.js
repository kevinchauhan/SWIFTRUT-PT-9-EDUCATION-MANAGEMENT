import Course from "../models/Course.js";
import User from "../models/User.js";

export class EnrollmentController {
    // Enroll a student in a course (Admin only)
    async enrollStudent(req, res) {
        try {
            const { courseId, studentId } = req.body;

            if (!courseId || !studentId) {
                return res.status(400).json({ success: false, message: "Course ID and Student ID are required" });
            }

            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }

            const student = await User.findById(studentId);
            if (!student || student.role !== "Student") {
                return res.status(400).json({ success: false, message: "Invalid student ID" });
            }

            if (course.enrolledStudents.includes(studentId)) {
                return res.status(400).json({ success: false, message: "Student is already enrolled in this course" });
            }

            course.enrolledStudents.push(studentId);
            await course.save();

            res.status(200).json({ success: true, message: "Student enrolled successfully", course });
        } catch (error) {
            console.error("Error in enrollStudent:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    // Remove a student from a course (Admin only)
    async removeStudent(req, res) {
        try {
            const { courseId, studentId } = req.body;

            if (!courseId || !studentId) {
                return res.status(400).json({ success: false, message: "Course ID and Student ID are required" });
            }

            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }

            const index = course.enrolledStudents.indexOf(studentId);
            if (index === -1) {
                return res.status(400).json({ success: false, message: "Student is not enrolled in this course" });
            }

            course.enrolledStudents.splice(index, 1);
            await course.save();

            res.status(200).json({ success: true, message: "Student removed successfully", course });
        } catch (error) {
            console.error("Error in removeStudent:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    // Get enrolled students for a course (Admin and Teacher only)
    async getEnrolledStudents(req, res) {
        try {
            const { courseId } = req.params;

            const course = await Course.findById(courseId).populate("enrolledStudents", "name email");
            if (!course) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }

            res.status(200).json({ success: true, enrolledStudents: course.enrolledStudents });
        } catch (error) {
            console.error("Error in getEnrolledStudents:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    // Get courses a student is enrolled in (Student only)
    async getStudentCourses(req, res) {
        try {
            const { id } = req.user;

            const courses = await Course.find({ enrolledStudents: id });
            res.status(200).json({ success: true, courses });
        } catch (error) {
            console.error("Error in getStudentCourses:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}
