import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res)=>{
    // get user details from frontend
    // check details (Null or not)
    // check if user already exist
    // check if avatar is present 
    // upload avatar and cover image at cloudinary , check avatar at cloudinary
    // make a user object
    // create a entry at db
    // check if user is created or not {remove password and refresh_token}
    // return response

    //json or form data can be get using {body}
    const {fullName, email, username, password} = req.body
    


    if(fullName==""){
        throw new ApiError(400, "full_name is required")
    }
    if(email==""){
        throw new ApiError(400, "Email is required")
    }
    if(username==""){
        throw new ApiError(400, "username is required")
    }
    if(password==""){
        throw new ApiError(400, "password is required")
    }


    const existeduser = User.findOne({                //Existed user is present or not
        $or: [{username},{email}]
    })

    if(existeduser){
        throw new ApiError(409,"User already exist !!")
    }

    const avatar_localpath = req.files?.avatar[0]?.path;   // storing image local path {?:maybe present or not} {[0]:first property (store path)}
    const cover_localpath = req.files?.coverImage[0]?.path;

    if(!avatar_localpath){
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatar_localpath) // upload on cloudinary
    const coverImage = await uploadOnCloudinary(cover_localpath)

    if(!avatar){
        throw new ApiError(400, "Avatar is required")
    }

    User.create({                       // Create db object
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = User.findById(User._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Sucessfully...")
    )

    
})

export {registerUser}