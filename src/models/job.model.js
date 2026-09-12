import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    recruiter: {
      type: Schema.Types.ObjectId,
      ref: "RecruiterProfile",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },

    requirements: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      trim: true,
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },

    workMode: {
      type: String,
      enum: ["On-site", "Hybrid", "Remote"],
      default: "On-site",
    },

    category: {
      type: String,
      enum: ["Software Development", "Design", "Marketing", "Sales", "Other"],
      default: "Other",
    },

    experienceLevel: {
      type: String,
      enum: ["Entry-level", "Mid-level", "Senior-level"],
      default: "Entry-level",
      required: true,
    },

    salary: {
      type: Number,
    },

    positions: {
      type: Number,
      default: 1,
      min: [1, "At least one position is required"],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Job = mongoose.model("Job", jobSchema);
