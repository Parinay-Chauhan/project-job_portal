import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middleware/Auth.middleware.js";
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

router.use(verifyJWT);
router.use(authorizeRoles("candidate"));

// Profile Routes
router
  .route("/profile")
  .post(createCandidateProfile)
  .get(getCandidateProfile)
  .patch(updateCandidateProfile);

// Experience Routes
router.route("/experience").post(addExperience);
router
  .route("/experience/:experienceId")
  .patch(updateExperience)
  .delete(deleteExperience);

// Education Routes
router.route("/education").post(addEducation);
router
  .route("/education/:educationId")
  .patch(updateEducation)
  .delete(deleteEducation);

// Resume Routes
router
  .route("/resume")
  .post(upload.single("resume"), uploadAndUpdateResume)
  .delete(deleteResume);

export default router;





































// ++++++++++++++++++  Old Candidate Route +++++++++++++++++++++++++++++++++++

// import { Router } from "express";
// import { verifyJWT } from "../middleware/Auth.middleware.js";
// import {
//   createCandidateProfile,
//   getCandidateProfile,
//   updateCandidateProfile,
//   addExperience,
//   updateExperience,
//   deleteExperience,
//   addEducation,
//   updateEducation,
//   deleteEducation,
//   uploadAndUpdateResume,
//   deleteResume,
// } from "../controllers/candidate.controller.js";
// import { upload } from "../middleware/multer.middleware.js";

// const router = Router();

// // Profile Routes
// router
//   .route("/profile")
//   .post(verifyJWT, createCandidateProfile)
//   .get(verifyJWT, getCandidateProfile)
//   .patch(verifyJWT, updateCandidateProfile);

// // Experience Routes
// router.route("/experience").post(verifyJWT, addExperience);
// router.patch("/experience/:experienceId", verifyJWT, updateExperience);
// router.delete("/experience/:experienceId", verifyJWT, deleteExperience);

// // Education Routes
// router.route("/education").post(verifyJWT, addEducation);
// router.patch("/education/:educationId", verifyJWT, updateEducation);
// router.delete("/education/:educationId", verifyJWT, deleteEducation);

// // router.route("/resume").post(verifyJWT, upload.single("resume"), uploadAndUpdateResume);
// router
//   .route("/resume")
//   .post(verifyJWT, upload.single("resume"), uploadAndUpdateResume)
//   .delete(verifyJWT, deleteResume);

// export default router;
