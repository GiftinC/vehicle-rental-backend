import express from "express";
import { createBooking, getUserBookings, cancelBooking, getBookingDetails, bookingConfirm } from "../controllers/bookingsController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/book", authenticateUser, createBooking);
router.get("/my-bookings", authenticateUser, getUserBookings);
router.delete("/cancel/:bookingId", authenticateUser, cancelBooking);
router.get("/:bookingId", authenticateUser, getBookingDetails);
router.put("/confirm/:bookingId", authenticateUser, bookingConfirm);

export default router;
