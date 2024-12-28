import express from "express";
import { AssignmentController } from "../controllers/AssignmentController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();
const assignmentController = new AssignmentController();

router.post("/", authenticate, authorize(["Teacher"]), assignmentController.createAssignment);
router.get("/:courseId", authenticate, assignmentController.getAssignments);
router.post("/submit", authenticate, authorize(["Student"]), assignmentController.submitAssignment);

export default router;
