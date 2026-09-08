import { Router } from "express";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import {
  addExperience,
  createCandidateProfile,
  getCandidateProfile,
  updateCandidateProfile,
} from "../controllers/candidate.controller.js";

const router = Router();

router
  .route("/profile")
  .post(verifyJWT, createCandidateProfile)
  .get(verifyJWT, getCandidateProfile);

router.route("/profile").patch(verifyJWT, updateCandidateProfile);

router.route("/experience").post(verifyJWT, addExperience);

export default router;
