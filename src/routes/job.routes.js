import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middleware/Auth.middleware.js";
import {
  postJob,
  getAllJobs,
  getMyPostedJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";

const router = Router();

// Public Routes
router.route("/").get(getAllJobs);
router.route("/get/:id").get(getJobById); // public view single job

// Recruiter Restricted Routes
router.route("/").post(verifyJWT, authorizeRoles("recruiter"), postJob);

router
  .route("/my-jobs")
  .get(verifyJWT, authorizeRoles("recruiter"), getMyPostedJobs);

router
  .route("/:id")
  .patch(verifyJWT, authorizeRoles("recruiter"), updateJob)
  .delete(verifyJWT, authorizeRoles("recruiter"), deleteJob);

export default router;
