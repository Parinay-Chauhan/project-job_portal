import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middleware/Auth.middleware.js";
import {
  createRecruiterProfile,
  getRecruiterProfile,
  updateRecruiterProfile,
} from "../controllers/recruiter.controller.js";


const router = Router();

// Only "recruiter" role can access these routes
router.use(verifyJWT);
router.use(authorizeRoles("recruiter"));
// router.use(verifyJWT, authorizeRoles("recruiter"));


// Profile Routes
router
  .route("/profile")
  .post(createRecruiterProfile)
  .get(getRecruiterProfile)
  .patch(updateRecruiterProfile);

export default router;
