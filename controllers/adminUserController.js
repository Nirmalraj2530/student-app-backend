import User from "../models/User.js";
import TestResult from "../models/TestResult.js";

// GET ALL USERS WITH LATEST TEST RESULTS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    
    // Get latest test result for each user
    const usersWithResults = await Promise.all(
      users.map(async (user) => {
        const latestTest = await TestResult.findOne({ userId: user._id })
          .sort({ createdAt: -1 })
          .lean();
        
        return {
          ...user,
          skill: latestTest?.skill || null,
          score: latestTest?.score || null,
          testDate: latestTest?.createdAt || null
        };
      })
    );
    
    res.json({ success: true, users: usersWithResults });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE USER
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
