import TestResult from "../models/TestResult.js";
import User from "../models/User.js";
import Question from "../models/Question.js";

export const submitTestResult = async (req, res) => {
  try {
    const { skill, score, correct, wrong, unattempted, totalQuestions, status, answers, userEmail } = req.body;

    // Find user by email or use authenticated user
    let userId = req.user?.id;
    
    if (!userId && userEmail) {
      const user = await User.findOne({ email: userEmail });
      if (user) {
        userId = user._id;
      }
    }

    if (!userId) {
      return res.status(400).json({ success: false, message: "User identification required" });
    }

    const testResult = await TestResult.create({
      userId,
      skill,
      score,
      correct,
      wrong,
      unattempted,
      totalQuestions,
      status,
      answers: answers || [],
    });

    res.status(201).json({ success: true, result: testResult });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTestResultById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TestResult.findById(id);
    
    if (!result) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDetailedReview = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TestResult.findById(id);
    
    if (!result) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    // Get all question IDs from answers
    const questionIds = result.answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    // Map questions with user answers
    const reviewQuestions = questions.map(q => {
      const userAnswer = result.answers.find(a => a.questionId.toString() === q._id.toString());
      return {
        _id: q._id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer: userAnswer?.selectedAnswer,
        explanation: q.explanation
      };
    });

    res.json({
      success: true,
      review: {
        score: result.score,
        correct: result.correct,
        wrong: result.wrong,
        questions: reviewQuestions
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserTestResults = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const results = await TestResult.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
