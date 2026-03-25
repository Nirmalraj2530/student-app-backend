import jwt from "jsonwebtoken";

// Hardcoded Admin (TEMP – ok for now)
const ADMIN_USER = {
  username: "admin",
  password: "admin123",
};

export const adminLogin = async (req, res) => {
  try {
    // 🔒 Defensive destructuring
    const username = req.body?.username?.trim();
    const password = req.body?.password?.trim();

    console.log("LOGIN ATTEMPT:", { username, password }); // keep for now

    if (username !== ADMIN_USER.username || password !== ADMIN_USER.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const token = jwt.sign(
      { role: "admin", username },
      process.env.JWT_SECRET, // ❗ NO fallback
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      message: "Admin login successful",
      token,
      admin: { username },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
