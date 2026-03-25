import express from "express";
import { getSkills, getSkillByKey } from "../controllers/adminSkillController.js";

const router = express.Router();
router.get("/", getSkills);
router.get("/:key", getSkillByKey);

export default router;
