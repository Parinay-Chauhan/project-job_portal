import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middleware/Auth.middleware.js";
import {
  createOrUpdateRecruiterProfile,
  getRecruiterProfile,
} from "../controllers/recruiter.controller.js";

const router = Router();

// Only "recruiter" role can access these routes
router.use(verifyJWT);
router.use(authorizeRoles("recruiter"));
// router.use(verifyJWT, authorizeRoles("recruiter"));


router
  .route("/profile")
  .post(createOrUpdateRecruiterProfile)
  .get(getRecruiterProfile)
  .patch(createOrUpdateRecruiterProfile);

export default router;
