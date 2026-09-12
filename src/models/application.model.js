import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent duplicate application by the same user for the same job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);