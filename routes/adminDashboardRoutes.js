import express from "express";
import { getDashboardStats, getRecentActivity, getPopularSkills } from "../controllers/adminDashboardController.js";

const router = express.Router();
router.get("/stats", getDashboardStats);
router.get("/recent-activity", getRecentActivity);
router.get("/popular-skills", getPopularSkills);
export default router;
