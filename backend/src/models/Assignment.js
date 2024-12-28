import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    submittedByStudents: [
        {
            student: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            submissionDate: {
                type: Date,
            },
            submission: {
                type: String,
            },
            grade: {
                type: String,
            },
        },
    ],
}, { timestamps: true });

export default mongoose.model("Assignment", AssignmentSchema);
