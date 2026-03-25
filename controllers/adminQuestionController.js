import Question from "../models/Question.js";

// GET ALL QUESTIONS WITH FILTERS
export const getQuestions = async (req, res) => {
  try {
    const { skill, difficulty, category } = req.query;

    let filter = { isActive: true };

    if (skill) filter.skill = skill;
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;

    const questions = await Question.find(filter)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.json({ success: true, total: questions.length, questions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET SINGLE QUESTION
export const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("createdBy", "name email");

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    res.json({ success: true, question });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE QUESTION
export const createQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer, explanation, skill, difficulty, category } =
      req.body;

    // Validation
    if (!question || !options || options.length < 2 || correctAnswer === undefined || !explanation || !skill) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    if (correctAnswer >= options.length || correctAnswer < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid correct answer index" });
    }

    const newQuestion = await Question.create({
      question,
      options,
      correctAnswer,
      explanation,
      skill,
      difficulty: difficulty || "Easy",
      category: category || skill,
      createdBy: req.user?.id || null,
    });

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      question: newQuestion,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE QUESTION
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, correctAnswer, explanation, skill, difficulty, category } =
      req.body;

    const existingQuestion = await Question.findById(id);
    if (!existingQuestion) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    // Validation
    if (
      options &&
      (correctAnswer === undefined || correctAnswer >= options.length || correctAnswer < 0)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid correct answer index" });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      {
        question: question || existingQuestion.question,
        options: options || existingQuestion.options,
        correctAnswer: correctAnswer !== undefined ? correctAnswer : existingQuestion.correctAnswer,
        explanation: explanation || existingQuestion.explanation,
        skill: skill || existingQuestion.skill,
        difficulty: difficulty || existingQuestion.difficulty,
        category: category || existingQuestion.category,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE QUESTION (SOFT DELETE)
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    res.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET QUESTIONS STATISTICS
export const getQuestionsStats = async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments({ isActive: true });

    const skillStats = await Question.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$skill", count: { $sum: 1 } } },
    ]);

    const difficultyStats = await Question.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$difficulty", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      totalQuestions,
      skillStats,
      difficultyStats,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};