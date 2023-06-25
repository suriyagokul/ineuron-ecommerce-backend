import {Router} from "express"
import {isLoggedIn, authorize} from "../middlewares/auth.middleware"
import AuthRoles from "../utils/authRoles.js"
import {createCoupon, updateCoupon, deleteCoupon, getAllCoupons} from "../controllers/coupon.controller"

const router = Router()

router.post("/", isLoggedIn, authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR), createCoupon)

router.put("/action/:id", isLoggedIn, authorize(AuthRoles.ADMIN), updateCoupon)

router.delete("/:id", isLoggedIn, authorize(AuthRoles.ADMIN), deleteCoupon)

router.get("/", isLoggedIn, authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR), getAllCoupons)




export default router