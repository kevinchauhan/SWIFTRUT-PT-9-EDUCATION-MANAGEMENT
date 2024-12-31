import express from "express";
import { EnrollmentController } from "../controllers/EnrollmentController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();
const enrollmentController = new EnrollmentController();

router.post("/enroll", authenticate, enrollmentController.enrollStudent);
router.post("/remove", authenticate, authorize(["Admin"]), enrollmentController.removeStudent);
router.get("/students/:courseId", authenticate, authorize(["Admin", "Teacher"]), enrollmentController.getEnrolledStudents);
router.get("/courses", authenticate, authorize(["Student"]), enrollmentController.getStudentCourses);

export default router;
