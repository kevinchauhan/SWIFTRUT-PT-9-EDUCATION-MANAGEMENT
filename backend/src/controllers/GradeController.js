import Course from "../models/Course.js";

export class GradeController {
    // Assign or update a grade for a student in a course (Teacher only)
    async assignGrade(req, res) {
        try {
            const { courseId, studentId, grade } = req.body;

            if (!courseId || !studentId || grade == null) {
                return res.status(400).json({ success: false, message: "Course ID, Student ID, and grade are required" });
            }

            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }

            if (!course.enrolledStudents.includes(studentId)) {
                return res.status(400).json({ success: false, message: "Student is not enrolled in this course" });
            }

            const gradeIndex = course.grades.findIndex((g) => g.student.toString() === studentId);

            if (gradeIndex === -1) {
                course.grades.push({ student: studentId, grade });
            } else {
                course.grades[gradeIndex].grade = grade;
            }

            await course.save();

            res.status(200).json({ success: true, message: "Grade assigned/updated successfully", course });
        } catch (error) {
            console.error("Error in assignGrade:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    // Get grades for a course (Teacher only)
    async getCourseGrades(req, res) {
        try {
            const { courseId } = req.params;

            const course = await Course.findById(courseId).populate("grades.student", "name email");
            if (!course) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }

            res.status(200).json({ success: true, grades: course.grades });
        } catch (error) {
            console.error("Error in getCourseGrades:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    // Get grades for a student in their courses (Student only)
    async getStudentGrades(req, res) {
        try {
            const { id } = req.user;

            const courses = await Course.find({ "grades.student": id }, { title: 1, grades: 1 }).populate("grades.student", "name email");

            const grades = courses.map((course) => ({
                courseId: course._id,
                courseTitle: course.title,
                grade: course.grades.find((g) => g.student.toString() === id)?.grade,
            }));

            res.status(200).json({ success: true, grades });
        } catch (error) {
            console.error("Error in getStudentGrades:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}
