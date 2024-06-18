import mongoose, {Schema, isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { Name, Description } = req.body;

    if (!Name || !Description) {
        throw new ApiError(400, "Name and Description are required");
    }

    if ([Name, Description].some((field) => field.trim() === "")) {
        throw new ApiError(400, "Name and Description should not be empty");
    }

    if (!req.user?._id) {
        throw new ApiError(401, "User ID is not available");
    }

    const playlist = await Playlist.create({
        name: Name,
        description: Description,
        owner: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201,"Playlist created Successfully..")
    )
});


const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    
    if(!isValidObjectId){
        throw new ApiError(400,"User_ID is not correct")
    }
    
    const userPlaylist = await Playlist.aggregate(
        [
            //for owner of playlist
            {
                $match: {
                    owner: ObjectId(userId)
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
                                _id: 1,
                                username: 1,
                                fullname: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    owner: {
                        $first: "$owner"
                    }
                }
            },
            //for videos of playlist
            {
                $lookup: {
                    from: "videos",
                    localField: "videos",
                    foreignField: "_id",
                    as: "videos",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                video: 1,
                                thumbnail: 1,
                                title: 1,
                                views: 1,
                                owner: 1
                            }
                        },
                        //for owner of videos
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner",
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 1,
                                            username: 1,
                                            fullname: 1,
                                            avatar: 1
                                        }
                                    }
                                ]
                            }

                        },
                        {
                            $addFields: {
                                owner: {
                                    $first: "$owner"
                                }
                            }
                        }

                    ]
                }
            },
            {
                $addFields: {
                    videos: {
                        $first: "$videos"
                    }
                }
            }

        ]
    )

    return res.status(200).json(
        new ApiResponse(200,userPlaylist,"Playlist fetched Succesfully")
    )
    
})


const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}