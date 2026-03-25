import User from "../models/User.js";
import TestResult from "../models/TestResult.js";
import Skill from "../models/Skill.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTests = await TestResult.countDocuments();

    const avgScoreAgg = await TestResult.aggregate([
      { $group: { _id: null, avgScore: { $avg: "$score" } } },
    ]);

    const activeSkills = await Skill.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalTests,
        averageScore: avgScoreAgg[0]?.avgScore?.toFixed(1) || 0,
        activeSkills,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const recentTests = await TestResult.find()
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const formatted = recentTests.map(test => ({
      user: test.userId?.name || "Unknown",
      skill: test.skill || "Unknown",
      score: test.score,
      status: test.status || "Completed",
      date: test.createdAt
    }));

    res.json({ success: true, recentTests: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPopularSkills = async (req, res) => {
  try {
    // Get skill usage count from test results
    const skillStats = await TestResult.aggregate([
      { $group: { _id: "$skill", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get all skills from Skill collection
    const allSkills = await Skill.find().lean();
    
    // Map stats with skill details
    const popularSkills = skillStats.map(stat => {
      const skillDetail = allSkills.find(s => s.title === stat._id);
      return {
        id: skillDetail?._id || stat._id,
        title: stat._id,
        icon: skillDetail?.icon || "📚",
        usageCount: stat.count
      };
    });

    res.json({ success: true, skills: popularSkills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
