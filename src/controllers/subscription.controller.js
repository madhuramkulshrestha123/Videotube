import mongoose, {Schema, isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel Id is not correct or unavailable")
    }

    if (!req.user?._id) {
        throw new ApiError(400, "Invalid LoggedIn user Id  !")
    }

    const subscriberId = req.user?._id

    const isSubscribed = await Subscription.findOne(
        {
            subscriber: subscriberId,
            channel: channelId
        }
    )

    let subscriptionstatus
    try {
        if(isSubscribed){         // if isSubscribed:true
            await Subscription.deleteOne({id: isSubscribed._id})
            subscriptionstatus = {isSubscribed:false} 
        }
        else{
            subscriptionstatus = {isSubscribed:true}  //if isSubscribed:false
        }
    } catch (error) {
        throw new ApiError(400, "Error while toggling Subscription")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, subscriptionstatus, "Toggle Subscription Sucessfully !")
        )

})

// controller to return subscriber list of a channel

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
        const { channelId } = req.params;
    
        if (!isValidObjectId(channelId)) {
            throw new ApiError(400, "Channel Id is not correct or unavailable");
        }
    
        const userSubscription = await Subscription.Aggregate([
            {
                $match: {
                    channel: ObjectId(channelId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalSubscribers: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalSubscribers: 1
                }
            }
        ])
    
        return res
            .status(200)
            .json(
                new ApiResponse(200, userSubscription[0] || { totalSubscribers: 0 }, "Subscribers fetched successfully!")
            )
})

    

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    // Validate subscriber ID
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(401, "Invalid subscriber Id!");
    }

    // Perform the aggregation to fetch subscribed channels
    const userChannels = await Subscription.aggregate([
        {
            $match: {
                subscriber: ObjectId(subscriberId)
            }
        },
        {
            // Look up channel details from the "users" collection
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribedTo",
                pipeline: [
                    {
                        // Only include specific fields
                        $project: {
                            fullname: 1,
                            username: 1,
                            isSubscribed: 1
                        }
                    }
                ]
            }
        },
        {
            // Flatten the subscribedTo array to a single object
            $addFields: {
                subscribedTo: {
                    $first: "$subscribedTo"
                }
            }
        }
    ]);

    // Extract the list of subscribed channels
    const channelsList = userChannels.map(channel => channel.subscribedTo);

    // Respond with the list of subscribed channels
    return res
        .status(200)
        .json(
            new ApiResponse(200, channelsList, "Subscribed channels fetched successfully!")
        );
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}