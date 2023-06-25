import {Router} from "express"
import {signUp, login, logout, getProfile, forgotPassword, resetPassword} from "../controllers/auth.controller.js"


const router = Router()

router.post("/signup", signUp)

router.post("/login", login)

router.get("/logout", logout)

router.get("/profile", getProfile)

router.post("/password/forgot", forgotPassword)

router.post("/password/reset/:token", resetPassword)

export default router;
