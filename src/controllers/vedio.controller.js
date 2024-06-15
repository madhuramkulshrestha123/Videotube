import mongoose, {isValidObjectId} from "mongoose"
import { Video } from "../models/vedio.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy = "title", sortType = "ascending", userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    const pageNumber = parseInt(page)
    const pageLimit = parseInt(limit)
    const skip = (pageNumber - 1) * pageLimit
    const sortdirection = sortType === "ascending" ? 1 : -1

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "usedId is not found, userId is required !")
    }

    try {
        const videos = await Video.aggregate(
            [
                {
                    $match: {
                        owner: ObjectId(userId) // new mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                        pipeline: [
                            {
                                $project: {
                                    fullname: 1,
                                    username: 1,
                                    avatar: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: pageLimit
                },
                {
                    $sort: { [sortBy]: sortdirection }
                }

            ])

        const totalVideos = await Video.countDocuments({ owner: userId })
        const totalPages = Math.ceil(totalVideos / pageLimit)

        return res
            .status(200)
            .json(
                new ApiResponse(200, { videos, totalPages, totalVideos }, "All videos fetched")
            )

    } catch (error) {
        throw new ApiError(400, "Error while fetching videos", error)
    }

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    // Validate fields
    if ([title, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Validate file existence
    const videoLocalPath = req.files?.videofile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video file and thumbnail are required");
    }

    // Upload to Cloudinary
    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile || !thumbnail) {
        throw new ApiError(400, "Error uploading video file and thumbnail");
    }

    // Create video entry
    const video = await Video.create({
        videofile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: videoFile.duration,
        owner: req.user?._id // Assuming user ID is stored in req.user
    });

    // Fetch the uploaded video
    const uploadedVideo = await Video.findById(video._id).populate('owner');

    if (!uploadedVideo) {
        throw new ApiError(500, "Something went wrong while uploading video");
    }

    return res.status(201).json(
        new ApiResponse(200, uploadedVideo, "Video uploaded successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "videoId is not correct to find video")
    }

    const vedio = await Video.findById(videoId)

    if(!vedio){
        throw new ApiError(404, "Vedio not found..")
    }

    const user = await User.findById(req.user?._id)

    if (!(user.watchHistory.includes(videoId))) {
        await Video.findByIdAndUpdate(videoId,
            {
                $inc: {
                    views: 1
                }
            },
            {
                new: true
            }
        )
    }

    ////set video_id in watchHistory of user

    await User.findByIdAndUpdate(req.user?._id,
        {
            $addToSet: {
                watchHistory: videoId
            }
        },
        {
            new: true
        }
    )


    return res.status(201).json(
        new ApiResponse(200, vedio, "Video found!!")
    );
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    const thumbnailLocalPath = req.file?.path;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "videoId is not correct to update video")
    }

    // Check if thumbnail is provided
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    // Update video details
    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: title,
                description: description
            }
        },
        { new: true }
    );

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Upload new thumbnail to Cloudinary
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail) {
        throw new ApiError(500, "Error uploading thumbnail to Cloudinary");
    }

    // Update video thumbnail URL
    video.thumbnail = thumbnail.url;
    await video.save();

    return res.
    status(200).json(
        200, vedio, "Vedio is updated!!"
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "videoId is not correct to update video")
    }

    // Find video by id
    const video = await Video.findById(videoId);

    if (video) {
        //function call
        try {
            await cloudinary.uploader.destroy(vedio.videoFile, { resource_type: 'video' })
            await cloudinary.uploader.destroy(video.thumbnail, { resource_type: 'image' });
        } catch (error) {
            throw new ApiError(400, "error while deleting video file from cloudinary")
        }
    }

    await video.remove();

    return res.status(200).json(new ApiResponse(200, {}, "Video deleted"));
});


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo
}