import {Router} from "express"
import {isLoggedIn, authorize} from "../middlewares/auth.middleware"
import AuthRoles from "../utils/authRoles.js"

import {createCollection, updateCollection, deleteCollection, getAllCollections} from "../controllers/collection.controller"

const router = Router()

router.post("/", isLoggedIn, authorize(AuthRoles.ADMIN), createCollection)

router.put("/:id", isLoggedIn, authorize(AuthRoles.ADMIN), updateCollection)

router.delete("/:id", isLoggedIn, authorize(AuthRoles.ADMIN), deleteCollection)

router.get("/", getAllCollections)


export default router
