import mongoose, { Schema } from "mongoose";

const CandidateProfile = new Schema(
  {
    // Single Reference to User Model
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One candidate profile per user
    },
    phone: {
      type: String, // String avoids issue with leading zeroes or '+' prefix
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    experience: [
      {
        company: String,
        title: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
      },
    ],
    resume: {
      type: String, // Cloudinary URL
    },
    resumePublicId: {
      type: String, // For deletion/updates on Cloudinary
    },
    linkedin: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    portfolio: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Candidate = mongoose.model("Candidate", CandidateProfile);

// Candidate with populated User fields
// const candidateProfile = await Candidate.findOne({ user: req.user._id }).populate(
//   "user",
//   "username email fullName avatar role"
// );

// import { Candidate } from "../models/candidate.model.js";
// import { asyncHandler } from "../utils/AsyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// Fetch Logged-In Candidate Profile
// const getCandidateProfile = asyncHandler(async (req, res) => {
//   const candidate = await Candidate.findOne({ user: req.user._id }).populate(
//     "user",
//     "username email fullName avatar role" // In fields ko User collection se le aayega
//   );

//   if (!candidate) {
//     throw new ApiError(404, "Candidate profile not found");
//   }

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, candidate, "Candidate profile fetched successfully")
//     );
// });

// export { getCandidateProfile };
