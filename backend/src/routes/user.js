import express from "express";
import { UserController } from "../controllers/UserController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();
const userController = new UserController();

router.get("/", authenticate, authorize(["Admin"]), userController.listUsers);
router.post("/", authenticate, authorize(["Admin"]), userController.createUser);
router.patch("/role", authenticate, authorize(["Admin"]), userController.updateUserRole);
router.delete("/:userId", authenticate, authorize(["Admin"]), userController.deleteUser);

export default router;
