import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true, // aptitude, communication, technical-mcq
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "📘",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
