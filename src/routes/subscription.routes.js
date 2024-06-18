import { Router } from 'express';
import {getSubscribedChannels,getUserChannelSubscribers,toggleSubscription,} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/c/:channelId").get(getSubscribedChannels).post(toggleSubscription); //channelId from URL (/c/:This route might handle requests related to content, categories, or other non-user-specific entities.)

router.route("/u/:subscriberId").get(getUserChannelSubscribers); //subscriberId from URL (/u/:This route is often used to handle requests related to user-specific actions or resources. For example:)

export default router