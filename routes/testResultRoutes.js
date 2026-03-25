import express from "express";
import { submitTestResult, getUserTestResults, getTestResultById, getDetailedReview } from "../controllers/testResultController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/submit", submitTestResult);
router.get("/user", protect, getUserTestResults);
router.get("/:id", getTestResultById);
router.get("/:id/review", getDetailedReview);

export default router;
