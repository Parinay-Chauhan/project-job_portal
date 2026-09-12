import { Job } from "../models/job.model.js";
import { RecruiterProfile } from "../models/recruiterProfile.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

// 1. Create a New Job Posting
const postJob = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    requirements,
    location,
    jobType,
    workMode,
    category,
    experienceLevel,
    salary,
    positions,
  } = req.body;

  // Validation
  if (
    [title, description, location].some(
      (field) => !field || field.trim() === "",
    )
  ) {
    throw new ApiError(400, "Title, description, and location are required");
  }

  if (salary === undefined || salary === null) {
    throw new ApiError(400, "Salary is required");
  }

  const salaryValue = Number(salary);
  if (!Number.isFinite(salaryValue) || salaryValue < 0) {
    throw new ApiError(400, "Salary must be a valid non-negative number");
  }

  // 3. Strict Numeric Validation for Positions
  let positionsValue = 1;
  if (positions !== undefined && positions !== null) {
    positionsValue = Number(positions);
    if (!Number.isInteger(positionsValue) || positionsValue < 1) {
      throw new ApiError(
        400,
        "Positions must be a valid positive integer (at least 1)",
      );
    }
  }

  // Ensure recruiter profile exists before posting job
  const recruiterProfile = await RecruiterProfile.findOne({
    user: req.user._id,
  });

  if (!recruiterProfile) {
    throw new ApiError(
      404,
      "Recruiter profile not found. Please create a profile first.",
    );
  }

  // Handle requirements as array if passed as comma-separated string or array
  let parsedRequirements = [];
  if (Array.isArray(requirements)) {
    parsedRequirements = requirements;
  } else if (typeof requirements === "string") {
    parsedRequirements = requirements.split(",").map((req) => req.trim());
  }

  const job = await Job.create({
    title: title.trim(),
    description: description.trim(),
    requirements: parsedRequirements,
    location: location.trim(),
    jobType: jobType || "Full-time",
    workMode: workMode || "On-site",
    category: category || "Other",
    experienceLevel: experienceLevel || "Entry-level",
    salary: salaryValue,
    positions: positionsValue,
    recruiter: recruiterProfile._id,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, job, "Job posted successfully"));
});

export { postJob };
