import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js" //For file handling in User-controller
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router= Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )//https:localhost:8000/api/v1/users/register


router.route("/login").post(loginUser) //https:localhost:8000/api/v1/users/login

router.route("/logout").post(verifyJWT, logoutUser)//https:localhost:8000/api/v1/users/logout

export default router;


















