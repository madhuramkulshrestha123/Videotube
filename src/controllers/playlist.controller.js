import mongoose, {Schema, isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/vedio.models.js"


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
    if(!isValidObjectId){
        throw new ApiError(400,"User_ID is not correct")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404,"Playlist not found..")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,playlist,"Playlist Found!!")
    )

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!(playlistId || videoId)){
        throw new ApiError(400,"Playlist ANd VideoId is required")
    }

    const video = await Video.findById(videoId)
    

    if(!video){
        throw new ApiError(400,"Video not found..")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(400,"playlist not found..")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $addToSet: {           //addToSet to add and unset to remove id
                videos: videoId
            }
        },
        {
            new: true
        }
    )
    if (!updatedPlaylist) {
        throw new ApiError(404, "Error while Adding video to playlist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "video added to the playlist")
        )

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!(playlistId || videoId)){
        throw new ApiError(400,"Playlist ANd VideoId is required")
    }

    const video = await Video.findById(videoId)
    

    if(!video){
        throw new ApiError(400,"Video not found..")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(400,"playlist not found..")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $unset: {            // unset : to remove the videoId in playlist
                videos: videoId
            }
        },
        {
            new: true
        }
    )
    if (!updatedPlaylist) {
        throw new ApiError(404, "Error while Removing video from the playlist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "video Removed from the playlist")
        )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    
    
    if (!playlistId) {
        throw new ApiError(400, "playlistId is required")
    }

    const playlist = await Playlist.findById(playlistId)
    
    const playlistDelete = await Playlist.deleteOne({ name: playlist.name, description: playlist.description })

    if (!playlistDelete) {
        throw new ApiError(400, "Error while deleting playlist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlistDelete, "Playlist deleted sucessfully")
        )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    if (!playlistId) {
        throw new ApiError(400, "playlistId is required")
    }
    
    const playlist = await Playlist.findById(playlistId)

    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $set: {
                name,
                description
            }
        },
        {
            new: true
        }
    )

    if (!updatedPlaylist) {
        throw new ApiError(400, "Error while updating name and description of playlist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "Playlist name and description updated sucessfully")
        )

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