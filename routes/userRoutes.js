import express from "express";
import { getDashboardData, getUserProfile } from "../controllers/userController.js";
import { updateUserProfile } from "../controllers/userController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", authenticateUser, getUserProfile);

router.put("/profile", authenticateUser, updateUserProfile);

router.get("/dashboard", authenticateUser, getDashboardData);

export default router;