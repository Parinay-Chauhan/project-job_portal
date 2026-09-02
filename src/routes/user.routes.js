import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changePassword,
  updateAccountDetails,
  updateUserAvatar,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/Auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.post("/test-upload", upload.single("avatar"), (req, res) => {
  res.status(200).json({
    message: "File uploaded successfully",
    file: req.file,
  });
});

router.post("/test-cloudinary", upload.single("avatar"), updateUserAvatar);

export default router;
