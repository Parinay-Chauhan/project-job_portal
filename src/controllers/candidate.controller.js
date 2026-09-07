import { asyncHandler } from "../utils/AsyncHandler.js";
import { Candidate } from "../models/candidateProfile.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCandidateProfile = asyncHandler(async (req, res) => {
  // 1. req.user se logged-in user lena & check karna user exist karta hai
  const user = req.user;

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  // 2. Check karna user.role === "candidate"
  if (user.role !== "candidate") {
    throw new ApiError(403, "Only candidates can create a candidate profile");
  }

  // 3. Check karna us user ka Candidate Profile already bana hua hai ya nahi
  const existingProfile = await Candidate.findOne({
    user: user._id,
  });

  if (existingProfile) {
    throw new ApiError(400, "Candidate profile already exists for this user");
  }

  // 4. Request body se profile data destructure / collect karna
  const {
    phone,
    bio,
    location,
    skills,
    experience,
    education,
    linkedin,
    github,
    portfolio,
  } = req.body;

  // Essential / Required fields validation
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    throw new ApiError(400, "At least one skill is required");
  }

  // 5. Candidate document create karna
  const candidateProfile = await Candidate.create({
    user: user._id, // User schema se link karne ke liye
    phone,
    bio,
    location,
    skills,
    experience,
    education,
    linkedin,
    github,
    portfolio,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        candidateProfile,
        "Candidate profile created successfully",
      ),
    );
});

const getCandidateProfile = asyncHandler(async (req, res) => {
  const candidateProfile = await Candidate.findOne({
    user: req.user._id,
  });

  if (!candidateProfile) {
    throw new ApiError(404, "Candidate profile not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        candidateProfile,
        "Candidate profile fetched successfully",
      ),
    );
});

export { createCandidateProfile, getCandidateProfile };
