import { RecruiterProfile } from "../models/recruiterProfile.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// 1. Create or Update Recruiter Profile
const createRecruiterProfile = asyncHandler(async (req, res) => {
  const {
    companyName,
    companyWebsite,
    companyDescription,
    location,
    industry,
  } = req.body;

  if (!companyName || companyName.trim() === "") {
    throw new ApiError(400, "Company name is required");
  }

  const profileFields = {
    user: req.user._id,
    companyName: companyName.trim(),
    companyWebsite: companyWebsite?.trim() || "",
    companyDescription: companyDescription?.trim() || "",
    location: location?.trim() || "",
    industry: industry?.trim() || "",
  };

  let profile = await RecruiterProfile.findOne({ user: req.user._id });

  if (profile) {
    // Update existing profile
    profile = await RecruiterProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileFields },
      { new: true, runValidators: true },
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, profile, "Recruiter profile updated successfully"),
      );
  }

  // Create new profile
  profile = await RecruiterProfile.create(profileFields);

  return res
    .status(201)
    .json(
      new ApiResponse(201, profile, "Recruiter profile created successfully"),
    );
});

// 2. Get Logged-in Recruiter Profile
const getRecruiterProfile = asyncHandler(async (req, res) => {
  const profile = await RecruiterProfile.findOne({
    user: req.user._id,
  }).populate("user", "fullName email username role");

  if (!profile) {
    throw new ApiError(404, "Recruiter profile not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, profile, "Recruiter profile fetched successfully"),
    );
});

// 3. Update Recruiter Profile (Optional)
const updateRecruiterProfile = asyncHandler(async (req, res) => {
  const {
    companyName,
    companyWebsite,
    companyDescription,
    location,
    industry,
  } = req.body;

  const profileFields = {};

  // 1. Validation for companyName if provided
  if (companyName !== undefined) {
    if (companyName.trim() === "") {
      throw new ApiError(400, "Company name cannot be empty");
    }
    profileFields.companyName = companyName.trim();
  }

  // 2. Only add fields that are explicitly provided in request body
  if (companyWebsite !== undefined)
    profileFields.companyWebsite = companyWebsite.trim();
  if (companyDescription !== undefined)
    profileFields.companyDescription = companyDescription.trim();
  if (location !== undefined) profileFields.location = location.trim();
  if (industry !== undefined) profileFields.industry = industry.trim();

  // 3. Update in MongoDB
  const profile = await RecruiterProfile.findOneAndUpdate(
    { user: req.user._id },
    { $set: profileFields },
    { new: true, runValidators: true },
  );

  if (!profile) {
    throw new ApiError(404, "Recruiter profile not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, profile, "Recruiter profile updated successfully"),
    );
});

// 1. Upload Logo
const uploadCompanyLogo = asyncHandler(async (req, res) => {
  const logoLocalPath = req.file?.path;

  if (!logoLocalPath) {
    throw new ApiError(400, "Company logo file is required");
  }

  const profile = await RecruiterProfile.findOne({ user: req.user._id });

  if (!profile) {
    throw new ApiError(404, "Recruiter profile not found");
  }

  if (profile.logoPublicId) {
    throw new ApiError(
      400,
      "Logo already exists. Use PATCH /recruiters/logo to update it.",
    );
  }

  const logo = await uploadOnCloudinary(logoLocalPath);

  // Cloudinary return structure safe access
  const logoUrl = logo?.secure_url || logo?.url;

  if (!logoUrl) {
    throw new ApiError(500, "Error while uploading logo to Cloudinary");
  }

  // Schema field is companyLogo, not logo
  profile.companyLogo = logoUrl;
  profile.logoPublicId = logo.public_id;
  await profile.save();

  return res
    .status(201)
    .json(new ApiResponse(201, profile, "Company logo uploaded successfully"));
});

// 2. Update Logo
const updateCompanyLogo = asyncHandler(async (req, res) => {
  const logoLocalPath = req.file?.path;

  if (!logoLocalPath) {
    throw new ApiError(400, "New logo file is required for update");
  }

  const profile = await RecruiterProfile.findOne({ user: req.user._id });

  if (!profile) {
    throw new ApiError(404, "Recruiter profile not found");
  }

  const oldLogoPublicId = profile.logoPublicId;
  const newLogo = await uploadOnCloudinary(logoLocalPath);
  const newLogoUrl = newLogo?.secure_url || newLogo?.url;

  if (!newLogoUrl) {
    throw new ApiError(500, "Error while uploading new logo to Cloudinary");
  }

  profile.companyLogo = newLogoUrl;
  profile.logoPublicId = newLogo.public_id;

  try {
    await profile.save();
  } catch (error) {
    // DB Save Fail Rollback: Orphaned Naye Asset ko Cloudinary se Clean karein
    if (newLogo.public_id) {
      await deleteFromCloudinary(newLogo.public_id);
    }
    throw new ApiError(500, "Failed to update profile logo in database");
  }

  if (oldLogoPublicId) {
    await deleteFromCloudinary(oldLogoPublicId);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Company logo updated successfully"));
});

// 3. Delete Logo
const deleteCompanyLogo = asyncHandler(async (req, res) => {
  const profile = await RecruiterProfile.findOne({ user: req.user._id });

  if (!profile) {
    throw new ApiError(404, "Recruiter profile not found");
  }

  if (!profile.logoPublicId) {
    throw new ApiError(400, "No logo found to delete");
  }

  await deleteFromCloudinary(profile.logoPublicId);

  profile.companyLogo = "";
  profile.logoPublicId = "";
  await profile.save();

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Company logo removed successfully"));
});

export {
  createRecruiterProfile,
  getRecruiterProfile,
  updateRecruiterProfile,
  uploadCompanyLogo,
  updateCompanyLogo,
  deleteCompanyLogo,
};
