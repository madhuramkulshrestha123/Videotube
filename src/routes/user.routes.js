import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
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
router.route("/refresh-token").post(refreshAccessToken)  // Refresh Token Endpoint


router.route("/change_password").post(verifyJWT,changeCurrentPassword)
router.route("/current_user").get(verifyJWT,getCurrentUser)   // get- no posting of load

router.route("/update_account").patch(verifyJWT,updateAccountDetails)  //patch- update
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/coverImage").patch(verifyJWT,updateUserCoverImage)

router.route("/c/:username").get(verifyJWT,getUserChannelProfile)  // /c/:username
router.route("/history").get(verifyJWT,getWatchHistory)


export default router;


















