import express from 'express';
import authenticateUser from '../middleware/authMiddleware.js';
import { addReview , getReviewDetails , deleteReview , updateReview } from '../controllers/reviewsController.js';


const router = express.Router();

router.get("/:vehicleId" , authenticateUser , getReviewDetails );

router.post("/:vehicleId", authenticateUser, addReview);

router.delete("/:id", authenticateUser, deleteReview);

router.put("/:id", authenticateUser, updateReview);

export default router;