import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.get("/profile", verifyToken, getProfile);

export default router;
