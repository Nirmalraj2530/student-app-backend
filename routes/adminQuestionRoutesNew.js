import express from "express";
import { createQuestion, getQuestions, updateQuestion, deleteQuestion } from "../controllers/adminQuestionControllerNew.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/questions", verifyToken, createQuestion);
router.get("/questions", verifyToken, getQuestions);
router.put("/questions/:id", verifyToken, updateQuestion);
router.delete("/questions/:id", verifyToken, deleteQuestion);

export default router;