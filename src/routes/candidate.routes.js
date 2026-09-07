import { Router } from "express";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import {
  createCandidateProfile,
  getCandidateProfile,
} from "../controllers/candidate.controller.js";

const router = Router();

router
  .route("/profile")
  .post(verifyJWT, createCandidateProfile)
  .get(verifyJWT, getCandidateProfile);

  
export default router;
