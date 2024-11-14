import express from "express";
import { createVehicle, getVehicles } from "../controllers/vehicleController.js";

const router = express.Router();

router.post("/", createVehicle);
router.get("/", getVehicles);

export default router;