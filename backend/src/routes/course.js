import express from "express";
import { CourseController } from "../controllers/CourseController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();
const courseController = new CourseController();

router.post("/", authenticate, authorize(["Admin"]), courseController.createCourse);
router.get("/", authenticate, courseController.getCourses);
router.put("/:courseId", authenticate, authorize(["Admin"]), courseController.updateCourse);
router.delete("/:courseId", authenticate, authorize(["Admin"]), courseController.deleteCourse);

export default router;
