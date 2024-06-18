import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, updateVideo } from "../controllers/vedio.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()
router.use(verifyJWT); 

router.route("/getvideos").get(getAllVideos)
router.route("/publish_video").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
        
    ]),publishAVideo)

router.route("/getVideoById").get(getVideoById)
router.route("/delvideo").delete(deleteVideo)
router.route("/update_video").patch(upload.single("thumbnail"), updateVideo)

export default router
