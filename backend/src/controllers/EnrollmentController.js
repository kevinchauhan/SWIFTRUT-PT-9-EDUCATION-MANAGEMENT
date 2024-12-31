import Course from "../models/Course.js";
import User from "../models/User.js";

export class EnrollmentController {
    // Admin enrolls a student in a course
    async enrollStudent(req, res) {
        try {
            const { courseId, } = req.body;
            const studentId = req.user.id;
            if (!courseId || !studentId) {
                return res.status(400).json({ success: false, message: "Course ID and Student ID are required" });
            }

            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }

            const student = await User.findById(studentId);
            if (!student) {
                return res.status(404).json({ success: false, message: "Student not found" });
            }

            // Check if the student is already enrolled
            if (course.enrolledStudents.includes(studentId)) {
                return res.status(400).json({ success: false, message: "Student is already enrolled in this course" });
            }

            // Enroll the student in the course
            course.enrolledStudents.push(studentId);
            await course.save();

            res.status(200).json({ success: true, message: "Student enrolled successfully" });
        } catch (error) {
            console.error("Error in enrollStudent:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    // Admin removes a student from a course
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

            // Remove the student from the enrolled students list
            const index = course.enrolledStudents.indexOf(studentId);
            if (index === -1) {
                return res.status(400).json({ success: false, message: "Student is not enrolled in this course" });
            }

            course.enrolledStudents.splice(index, 1);
            await course.save();

            res.status(200).json({ success: true, message: "Student removed from course" });
        } catch (error) {
            console.error("Error in removeStudent:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    // Get all enrolled students for a course
    async getEnrolledStudents(req, res) {
        try {
            const { courseId } = req.params;

            const course = await Course.findById(courseId).populate("enrolledStudents", "_idname email");
            if (!course) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }

            res.status(200).json({ success: true, enrolledStudents: course.enrolledStudents });
        } catch (error) {
            console.error("Error in getEnrolledStudents:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    // Get all courses a student is enrolled in
    async getStudentCourses(req, res) {
        try {
            const studentId = req.user.id;

            const courses = await Course.find({ enrolledStudents: studentId }).populate("teacher", "name email");

            res.status(200).json({ success: true, courses });
        } catch (error) {
            console.error("Error in getStudentCourses:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}
