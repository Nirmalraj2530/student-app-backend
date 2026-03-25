import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, phone, degree, yearOfPassing } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      phone,
      degree,
      yearOfPassing,
    });

    const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// LOGIN (EMAIL ONLY)
export const login = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
