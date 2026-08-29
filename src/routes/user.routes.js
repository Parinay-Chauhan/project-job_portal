import { Router } from 'express'
import { registerUser, loginUser, logoutUser, refreshAccessToken } from '../controllers/user.controller.js'
import { verifyJWT } from '../middleware/Auth.middleware.js'

const router = Router()

router.route('/register').post(registerUser)
router.route("/login").post(loginUser)


// Secured routes
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/refresh-token').post(refreshAccessToken)

export default router;