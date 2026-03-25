import express from "express";
import {
  getSkills,
  getSkillByKey,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/adminSkillController.js";
// import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.use(protect, adminOnly);

router.get("/", getSkills);
router.get("/:key", getSkillByKey);
router.post("/", createSkill);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

export default router;
