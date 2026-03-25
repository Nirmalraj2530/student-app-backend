import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import taskRoutes from "./routes/TaskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import adminQuestionRoutes from "./routes/adminQuestionRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import adminSkillRoutes from "./routes/adminSkillRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import testResultRoutes from "./routes/testResultRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/questions", adminQuestionRoutes);
app.use("/api/admin/skills", adminSkillRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/test-results", testResultRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
