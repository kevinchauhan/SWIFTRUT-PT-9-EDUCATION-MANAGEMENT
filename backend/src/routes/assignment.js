import express from "express";
import { AssignmentController } from "../controllers/AssignmentController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();
const assignmentController = new AssignmentController();

router.post("/assignments", authenticate, authorize(["Teacher"]), assignmentController.createAssignment);
router.get("/assignments/:courseId", authenticate, assignmentController.getAssignments);
router.post("/assignments/submit", authenticate, authorize(["Student"]), assignmentController.submitAssignment);

export default router;
