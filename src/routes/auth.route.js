import {Router} from "express"
import {signUp, login, logout, getProfile} from "../controllers/auth.controller.js"


const router = Router()

router.post("/signup", signUp)
router.post("/login", login)
router.get("/logout", logout)

router.get("/profile", getProfile)

export default router;
