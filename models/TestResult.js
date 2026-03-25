import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skill: {
      type: String,
      required: true,
    },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedAnswer: Number,
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    correct: {
      type: Number,
      required: true,
    },
    wrong: {
      type: Number,
      required: true,
    },
    unattempted: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 10,
    },
    status: {
      type: String,
      enum: ["PASSED", "FAILED"],
      default: "PASSED",
    },
    timeTaken: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      default: "Mixed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TestResult", testResultSchema);