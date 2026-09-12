import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middleware/Auth.middleware.js";
import { postJob } from "../controllers/job.controller.js";

const router = Router();

// Recruiter-only route for creating jobs
router
  .route("/")
  .post(verifyJWT, authorizeRoles("recruiter"), postJob);

export default router;