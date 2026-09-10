import { Router } from "express";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import {
  createCandidateProfile,
  getCandidateProfile,
  updateCandidateProfile,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  uploadAndUpdateResume,
  deleteResume,
} from "../controllers/candidate.controller.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();

router
  .route("/profile")
  .post(verifyJWT, createCandidateProfile)
  .get(verifyJWT, getCandidateProfile);
router.route("/profile").patch(verifyJWT, updateCandidateProfile);

router.route("/experience").post(verifyJWT, addExperience);
router.patch("/experience/:experienceId", verifyJWT, updateExperience);
router.delete("/experience/:experienceId", verifyJWT, deleteExperience);

router.route("/education").post(verifyJWT, addEducation);
router.patch("/education/:educationId", verifyJWT, updateEducation);
router.delete("/education/:educationId", verifyJWT, deleteEducation);

// router.route("/resume").post(verifyJWT, upload.single("resume"), uploadAndUpdateResume);
router
  .route("/resume")
  .post(verifyJWT, upload.single("resume"), uploadAndUpdateResume)
  .delete(verifyJWT, deleteResume);

export default router;
