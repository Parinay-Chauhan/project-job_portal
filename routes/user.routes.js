import express from 'express'
import { Router } from 'express'
import { registerUser } from '../controllers/user.controller'

const router = Router()

router.route('/register').post(registerUser)

export default router;