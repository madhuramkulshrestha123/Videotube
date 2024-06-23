import { Router } from 'express';
import {addVideoToPlaylist,createPlaylist,deletePlaylist,getPlaylistById,getUserPlaylists,removeVideoFromPlaylist,updatePlaylist,} from "../controllers/playlist.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); 

router.route("/create_playlist").post(createPlaylist)

router.route("/:playlistId").get(getPlaylistById)
router.route("/:playlistId").patch(updatePlaylist)
router.route("/:playlistId").delete(deletePlaylist)

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist); //add
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist); //remove

router.route("/user/:userId").get(getUserPlaylists);

export default router