import express from "express";
import { EnrollmentController } from "../controllers/EnrollmentController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();
const enrollmentController = new EnrollmentController();

router.post("/enroll", authenticate, authorize(["Admin"]), enrollmentController.enrollStudent);
router.post("/remove", authenticate, authorize(["Admin"]), enrollmentController.removeStudent);
router.get("/:courseId/enrolled", authenticate, authorize(["Admin", "Teacher"]), enrollmentControllergetEnrolledStudents);
router.get("/my-courses", authenticate, authorize(["Student"]), enrollmentController.getStudentCourses);

export default router;
