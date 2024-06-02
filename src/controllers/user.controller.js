import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res)=>{
    return res.status(201).json({
        message: "Okay"
    })
})

export {registerUser}