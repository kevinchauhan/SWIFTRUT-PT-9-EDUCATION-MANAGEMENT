import express from "express";
import { GradeController } from "../controllers/GradeController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();
const gradeController = new GradeController();

router.post("/assign", authenticate, authorize(["Teacher"]), gradeController.assignGrade);
router.get("/:courseId", authenticate, authorize(["Teacher"]), gradeController.getCourseGrades);
router.get("/my-grades", authenticate, authorize(["Student"]), gradeController.getStudentGrades);

export default router;
