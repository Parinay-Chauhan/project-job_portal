import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

// 1. Apply For Job (Candidate Only)
const applyJob = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const jobId = req.params.id;

  if (!jobId) {
    throw new ApiError(400, "Job ID is required");
  }

  // Check if job exists and is active
  const job = await Job.findById(jobId);
  if (!job || !job.isActive) {
    throw new ApiError(404, "Job not found or no longer active");
  }

  // Check duplicate application
  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: userId,
  });

  if (existingApplication) {
    throw new ApiError(400, "You have already applied for this job");
  }

  // Create Application
  const newApplication = await Application.create({
    job: jobId,
    applicant: userId,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, newApplication, "Applied for job successfully")
    );
});

// 2. Get All Applied Jobs (Candidate Only)
const getAppliedJobs = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const applications = await Application.find({ applicant: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "job",
      populate: {
        path: "recruiter",
        select: "companyName companyLogo location",
      },
    });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        applications,
        "Applied jobs fetched successfully"
      )
    );
});

// 3. Get Applicants For a Job (Recruiter Only)
const getApplicants = asyncHandler(async (req, res) => {
  const jobId = req.params.id;

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Verification: Ensure the logged-in recruiter owns this job
  if (job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to view applicants for this job");
  }

  const applications = await Application.find({ job: jobId })
    .sort({ createdAt: -1 })
    .populate({
      path: "applicant",
      select: "fullName email avatar",
    });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        applications,
        "Applicants fetched successfully"
      )
    );
});

// 4. Update Application Status (Recruiter Only)
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const applicationId = req.params.id;

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const validStatuses = ["pending", "reviewed", "accepted", "rejected"];
  if (!validStatuses.includes(status.toLowerCase())) {
    throw new ApiError(400, "Invalid status value");
  }

  const application = await Application.findById(applicationId).populate("job");

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  // Authorization check
  if (application.job.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this application status");
  }

  application.status = status.toLowerCase();
  await application.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, application, "Application status updated successfully")
    );
});

export { applyJob, getAppliedJobs, getApplicants, updateStatus };