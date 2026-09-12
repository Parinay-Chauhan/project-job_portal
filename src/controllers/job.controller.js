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

// 2. Get All Jobs (Public / Candidate Feed with Filtering & Search)
const getAllJobs = asyncHandler(async (req, res) => {
  const { keyword, location, jobType, page = 1, limit = 10 } = req.query;

  const query = { isActive: true };

  // Search keyword in title or description
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (jobType) {
    query.jobType = jobType;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const jobs = await Job.find(query)
    .populate({
      path: "recruiter",
      select: "companyName companyLogo location industry",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const totalJobs = await Job.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        jobs,
        pagination: {
          totalJobs,
          currentPage: Number(page),
          totalPages: Math.ceil(totalJobs / Number(limit)),
        },
      },
      "Jobs fetched successfully",
    ),
  );
});

// 3. Get Recruiter's Posted Jobs
const getMyPostedJobs = asyncHandler(async (req, res) => {
  const recruiterProfile = await RecruiterProfile.findOne({
    user: req.user._id,
  });

  if (!recruiterProfile) {
    throw new ApiError(404, "Recruiter profile not found");
  }

  const jobs = await Job.find({ recruiter: recruiterProfile._id })
    .populate("recruiter", "companyName companyLogo location industry")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, jobs, "Posted jobs fetched successfully"));
});

// // 4. Get Single Job Details by ID
// const getJobById = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const job = await Job.findById(id).populate({
//     path: "recruiter",
//     select:
//       "companyName companyLogo companyWebsite companyDescription location industry",
//   });

//   if (!job) {
//     throw new ApiError(404, "Job not found");
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, job, "Job details fetched successfully"));
// });

// // 5. Update Job (Recruiter Only)
// const updateJob = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const job = await Job.findById(id);

//   if (!job) {
//     throw new ApiError(404, "Job not found");
//   }

//   // Authorization check: Only the recruiter who created the job can update it
//   if (job.createdBy.toString() !== req.user._id.toString()) {
//     throw new ApiError(403, "You are not authorized to update this job");
//   }

//   const updatedJob = await Job.findByIdAndUpdate(
//     id,
//     { $set: req.body },
//     { returnDocument: "after", runValidators: true },
//   );

//   return res
//     .status(200)
//     .json(new ApiResponse(200, updatedJob, "Job updated successfully"));
// });

// // 6. Delete Job (Recruiter Only)
// const deleteJob = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const job = await Job.findById(id);

//   if (!job) {
//     throw new ApiError(404, "Job not found");
//   }

//   if (job.createdBy.toString() !== req.user._id.toString()) {
//     throw new ApiError(403, "You are not authorized to delete this job");
//   }

//   await Job.findByIdAndDelete(id);

//   return res
//     .status(200)
//     .json(new ApiResponse(200, {}, "Job deleted successfully"));
// });

export {
  postJob,
  getAllJobs,
  getMyPostedJobs,
//   getJobById,
//   updateJob,
//   deleteJob,
};


