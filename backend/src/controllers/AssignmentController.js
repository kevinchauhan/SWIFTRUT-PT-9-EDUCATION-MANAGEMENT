import Assignment from "../models/Assignment.js";
import Course from "../models/Course.js";

export class AssignmentController {
    // Create or upload an assignment (Teacher only)
    async createAssignment(req, res) {
        try {
            const { courseId, title, description, dueDate } = req.body;

            if (!courseId || !title || !description || !dueDate) {
                return res.status(400).json({ success: false, message: "All fields are required" });
            }

            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }

            const assignment = new Assignment({
                title,
                description,
                dueDate,
                courseId,
                teacher: req.user.id,
            });

            await assignment.save();

            res.status(201).json({ success: true, assignment });
        } catch (error) {
            console.error("Error in createAssignment:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    // Get all assignments for a course (Teacher and Student)
    async getAssignments(req, res) {
        try {
            const { courseId } = req.params;

            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }

            const assignments = await Assignment.find({ courseId }).populate("teacher", "name");

            res.status(200).json({ success: true, assignments });
        } catch (error) {
            console.error("Error in getAssignments:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    // Submit an assignment (Student only)
    async submitAssignment(req, res) {
        try {
            const { assignmentId, submission } = req.body;

            if (!submission) {
                return res.status(400).json({ success: false, message: "Submission is required" });
            }

            const assignment = await Assignment.findById(assignmentId);
            if (!assignment) {
                return res.status(404).json({ success: false, message: "Assignment not found" });
            }

            const studentSubmissionIndex = assignment.submittedByStudents.findIndex(
                (s) => s.student.toString() === req.user.id
            );

            if (studentSubmissionIndex === -1) {
                assignment.submittedByStudents.push({
                    student: req.user.id,
                    submission,
                    submissionDate: new Date(),
                });
            } else {
                assignment.submittedByStudents[studentSubmissionIndex].submission = submission;
                assignment.submittedByStudents[studentSubmissionIndex].submissionDate = new Date();
            }

            await assignment.save();

            res.status(200).json({ success: true, message: "Assignment submitted successfully" });
        } catch (error) {
            console.error("Error in submitAssignment:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
}
