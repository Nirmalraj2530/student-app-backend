import Skill from "../models/Skill.js";

// GET ALL SKILLS
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json({ success: true, skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SKILL BY KEY
export const getSkillByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const skill = await Skill.findOne({ key });

    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    res.json({ success: true, skill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE SKILL
export const createSkill = async (req, res) => {
  try {
    const { key, title, description, icon } = req.body;

    const exists = await Skill.findOne({ key });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Skill already exists",
      });
    }

    const skill = await Skill.create({
      key,
      title,
      description,
      icon,
    });

    res.status(201).json({ success: true, skill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE SKILL
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    res.json({ success: true, skill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE (HARD)
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    res.json({ success: true, message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
